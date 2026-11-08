from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db, User, hash_password, verify_password
from ..schemas import UserCreate, UserLogin, TokenResponse, UserResponse, ForgotPasswordRequest
from ..auth import create_access_token, get_current_user

router = APIRouter(tags=["Authentication"])

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Şifre sıfırlama bağlantısı isteği:
    E-posta kontrol edilir ve kullanıcıya şifre sıfırlama simülasyonu bağlantısı onaylanır.
    """
    # Öğrencinin e-postasını alıp güvenli bir şekilde sıfırlama bağlantısı gönderim simülasyonu
    return {
        "message": "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin."
    }


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Yeni kullanıcı kaydı oluşturur:
    - E-posta benzersizliğini kontrol eder.
    - Şifreyi bcrypt ile hashleyerek SQLite veritabanına kaydeder.
    """
    # 1. E-posta benzersizlik kontrolü
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kayıtlı."
        )
    
    # 2. Şifreyi bcrypt ile hashle ve kullanıcıyı oluştur
    validated_role = user_in.role if user_in.role in ["student", "teacher"] else "student"
    user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role=validated_role
    )
    
    # İsteğe bağlı alanlar
    if user_in.full_name:
        user.full_name = user_in.full_name
    else:
        user.full_name = user_in.email.split('@')[0].capitalize()

    if user_in.current_level:
        user.current_level = user_in.current_level

    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. JWT erişim belirteci oluştur ve yanıt dön
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": getattr(user, 'role', 'student')})
    return {
        "message": "Kayıt işlemi başarıyla tamamlandı.",
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/set-admin/{email}", status_code=status.HTTP_200_OK)
def set_admin_role(email: str, db: Session = Depends(get_db)):
    """Kurucu veya eğitmen e-postasını admin olarak yetkilendirir."""
    target_user = db.query(User).filter(User.email == email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")
    target_user.role = "admin"
    db.commit()
    return {"message": f"{email} adresi başarıyla admin olarak yetkilendirildi.", "user_id": target_user.id, "role": target_user.role}

@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Kullanıcı girişi yapar:
    - E-posta ile kullanıcıyı arar.
    - bcrypt ile şifrenin doğruluğunu kontrol eder.
    - Başarılıysa JWT token döner, hatalıysa 401 hatası fırlatır.
    """
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı."
        )
    
    # Kurucu e-postaları için otomatik admin garanti kontrolü
    if user.email.lower() in ["darelderin@gmail.com", "proscale@gmail.com"] and user.role != "admin":
        user.role = "admin"
        db.commit()
        db.refresh(user)
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": getattr(user, 'role', 'student')})
    return {
        "message": "Giriş başarılı.",
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Aktif oturum açmış kullanıcının profil bilgilerini döner."""
    return current_user

@router.post("/demo/{role}", response_model=TokenResponse)
def demo_login(role: str, db: Session = Depends(get_db)):
    """Öğretmen veya öğrenci demo hesabı ile tek tıkla hızlı giriş."""
    target_email = "ogretmen@derintalks.com" if role == "teacher" else "ogrenci@derintalks.com"
    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        # Eğer demo kullanıcısı yoksa otomatik oluştur
        user = User(
            email=target_email,
            password_hash=hash_password("123456")
        )
        user.full_name = "Ayşe Kaya (Eğitmen)" if role == "teacher" else "Can Demir (Öğrenci)"
        user.role = "teacher" if role == "teacher" else "student"
        db.add(user)
        db.commit()
        db.refresh(user)
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": getattr(user, 'role', 'student')})
    return {
        "message": f"Demo {role} girişi başarılı.",
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }
