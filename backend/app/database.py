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

# 4. Users Tablosu Modeli (id, email, password_hash)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    # Gerçek veritabanı sütunu: öğrenci veya öğretmen rolü
    role = Column(String(50), nullable=False, default='student', server_default='student')

    # Class-level defaults (sütun olmayan ek alanlar için)
    full_name = "Kullanıcı"
    current_level = "A1"
    streak_days = 1
    xp_points = 120
    avatar_seed = "Felix"
    created_at = None

    def __init__(self, **kwargs):
        self.full_name = kwargs.get('full_name') or (kwargs.get('email', '').split('@')[0].capitalize() if kwargs.get('email') else "Kullanıcı")
        self.role = kwargs.get('role', 'student')
        self.current_level = kwargs.get('current_level', 'A1')
        self.streak_days = kwargs.get('streak_days', 1)
        self.xp_points = kwargs.get('xp_points', 120)
        self.avatar_seed = kwargs.get('avatar_seed', 'Felix')
        self.created_at = kwargs.get('created_at', None)

        for k, v in kwargs.items():
            setattr(self, k, v)

    @reconstructor
    def init_on_load(self):
        """SQLAlchemy bir kaydı DB'den çektiğinde çalışır; sütun olmayan alanları doldurur."""
        if not getattr(self, 'full_name', None):
            self.full_name = self.email.split('@')[0].capitalize() if self.email else "Kullanıcı"
        if not getattr(self, 'current_level', None):
            self.current_level = "A1"
        if not getattr(self, 'streak_days', None):
            self.streak_days = 1
        if not getattr(self, 'xp_points', None):
            self.xp_points = 120
        if not getattr(self, 'avatar_seed', None):
            self.avatar_seed = "Felix"

    # Geriye dönük uyumluluk için hashed_password getter ve setter
    @property
    def hashed_password(self):
        return self.password_hash

    @hashed_password.setter
    def hashed_password(self, value):
        self.password_hash = value

    def __repr__(self):
        return f"<User id={self.id} email='{self.email}'>"

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
        if 'role' not in columns:
            conn.execute(sqlalchemy.text(
                "ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'student'"
            ))
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
