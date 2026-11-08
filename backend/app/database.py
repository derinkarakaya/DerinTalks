import os
import bcrypt
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, reconstructor

# 1. SQLite Veritabanı Dosya Yolu Yapılandırması
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "derintalks.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# 2. SQLite Bağlantı Motoru (Engine)
# check_same_thread=False: FastAPI isteklerinde eşzamanlı SQLite erişimine izin verir
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# 3. Veritabanı Oturum Yapılandırması (SessionLocal) ve Temel Model (Base)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. Users Tablosu Modeli (id, email, password_hash, role, full_name, current_level, streak_days, xp_points, avatar_seed)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    # Gerçek veritabanı sütunları
    role = Column(String(50), nullable=False, default='student', server_default='student')
    full_name = Column(String(255), nullable=False, default='Öğrenci', server_default='Öğrenci')
    current_level = Column(String(10), nullable=False, default='A1', server_default='A1')
    streak_days = Column(Integer, nullable=False, default=1, server_default='1')
    xp_points = Column(Integer, nullable=False, default=120, server_default='120')
    avatar_seed = Column(String(50), nullable=False, default='Felix', server_default='Felix')

    # Geriye dönük uyumluluk için hashed_password getter ve setter
    @property
    def hashed_password(self):
        return self.password_hash

    @hashed_password.setter
    def hashed_password(self, value):
        self.password_hash = value

    def __repr__(self):
        return f"<User id={self.id} email='{self.email}' full_name='{self.full_name}' role='{self.role}'>"

# 5. bcrypt ile Güvenli Şifreleme Fonksiyonları
def hash_password(password: str) -> str:
    """Verilen düz metin şifreyi bcrypt ile tuzlayarak (salt) güvenli şekilde hashler."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, password_hash: str) -> bool:
    """Düz metin şifre ile veritabanındaki bcrypt hash'inin doğruluğunu kontrol eder."""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), password_hash.encode('utf-8'))
    except Exception:
        return False

# 6. Veritabanını ve 'users' Tablosunu Oluşturma + Migrasyon Fonksiyonları
def migrate_db():
    """
    Mevcut tablolara yeni sütunlar ekler (SQLite ALTER TABLE).
    Bu fonksiyon idempotent'tir — sütun zaten varsa sessizce devam eder.
    """
    import sqlalchemy
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text("PRAGMA table_info(users)"))
        columns = [row[1] for row in result.fetchall()]
        
        column_defs = {
            'role': "ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'student'",
            'full_name': "ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NOT NULL DEFAULT 'Öğrenci'",
            'current_level': "ALTER TABLE users ADD COLUMN current_level VARCHAR(10) NOT NULL DEFAULT 'A1'",
            'streak_days': "ALTER TABLE users ADD COLUMN streak_days INTEGER NOT NULL DEFAULT 1",
            'xp_points': "ALTER TABLE users ADD COLUMN xp_points INTEGER NOT NULL DEFAULT 120",
            'avatar_seed': "ALTER TABLE users ADD COLUMN avatar_seed VARCHAR(50) NOT NULL DEFAULT 'Felix'",
        }

        for col_name, sql in column_defs.items():
            if col_name not in columns:
                conn.execute(sqlalchemy.text(sql))

        # Demo ve kurucu hesaplarının verilerini zenginleştir
        conn.execute(sqlalchemy.text("""
            UPDATE users SET full_name = 'Can Demir', current_level = 'B1', streak_days = 5, xp_points = 840, avatar_seed = 'Can'
            WHERE email = 'ogrenci@derintalks.com' AND (full_name = 'Öğrenci' OR full_name IS NULL)
        """))
        conn.execute(sqlalchemy.text("""
            UPDATE users SET full_name = 'Ayşe Kaya (Eğitmen)', current_level = 'C2', streak_days = 18, xp_points = 2400, avatar_seed = 'Ayse', role = 'teacher'
            WHERE email = 'ogretmen@derintalks.com' AND (full_name = 'Öğrenci' OR full_name IS NULL)
        """))
        conn.execute(sqlalchemy.text("""
            UPDATE users SET full_name = 'Derin Karakaya', role = 'admin', current_level = 'C2', xp_points = 4850, streak_days = 24
            WHERE email IN ('darelderin@gmail.com', 'proscale@gmail.com')
        """))
        conn.commit()

def init_db():
    """SQLite veritabanı dosyasını ve users tablosunu oluşturur; gerekli migrasyonları çalıştırır."""
    Base.metadata.create_all(bind=engine)
    migrate_db()

# 7. FastAPI Bağımlılık Enjeksiyonu (Dependency Injection)
def get_db():
    """Her API isteği için bağımsız bir veritabanı oturumu oluşturur ve kapatır."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print(f"SQLite veritabanı ve 'users' tablosu (id, email, password_hash, role) başarıyla hazırlandı: {DB_PATH}")
