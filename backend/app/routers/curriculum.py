from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CurriculumModule, StudentProgress, User
from ..schemas import ModuleResponse, ModuleSubmit
from ..auth import get_current_user

router = APIRouter(prefix="/api/curriculum", tags=["Curriculum"])

LEVEL_DESCRIPTIONS = {
    "A1": {"name": "A1 Başlangıç (Beginner)", "summary": "Temel selamlaşmalar, günlük rutinler ve basit soru cümleleri"},
    "A2": {"name": "A2 Temel (Elementary)", "summary": "Geçmiş zaman, seyahat diyalogları ve sıfat karşılaştırmaları"},
    "B1": {"name": "B1 Orta Öncesi (Intermediate)", "summary": "Deneyimler, tavsiye kipleri, uzaktan çalışma ve akıcı iletişim"},
    "B2": {"name": "B2 Orta Üstü (Upper-Intermediate)", "summary": "Varsayımsal durumlar, yapay zeka makaleleri ve akademik tartışma"},
    "C1": {"name": "C1 İleri Seviye (Advanced)", "summary": "Devrik cümleler, diplomatik söylemler ve üst düzey okuma"},
    "C2": {"name": "C2 Ustalık (Mastery)", "summary": "Ana dili düzeyinde edebi çözümlemeler, retorik ve derin nüanslar"}
}

@router.get("/levels")
def get_all_levels(db: Session = Depends(get_db)):
    levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
    results = []
    for lvl in levels:
        count = db.query(CurriculumModule).filter(CurriculumModule.level == lvl).count()
        results.append({
            "code": lvl,
            "title": LEVEL_DESCRIPTIONS[lvl]["name"],
            "description": LEVEL_DESCRIPTIONS[lvl]["summary"],
            "total_modules": count
        })
    return results

@router.get("/modules/{level}", response_model=List[ModuleResponse])
def get_level_modules(
    level: str,
    module_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(CurriculumModule).filter(CurriculumModule.level == level.upper())
    if module_type:
        query = query.filter(CurriculumModule.module_type == module_type)
    
    modules = query.order_by(CurriculumModule.order_index).all()
    
    # Attach student progress
    res = []
    for mod in modules:
        prog = db.query(StudentProgress).filter(
            StudentProgress.student_id == current_user.id,
            StudentProgress.module_id == mod.id
        ).first()

        mod_dict = {
            "id": mod.id,
            "level": mod.level,
            "module_type": mod.module_type,
            "title": mod.title,
            "subtitle": mod.subtitle,
            "description": mod.description,
            "content_json": mod.content_json,
            "order_index": mod.order_index,
            "estimated_minutes": mod.estimated_minutes,
            "created_at": mod.created_at,
            "completed": prog.completed if prog else False,
            "score": prog.score if prog else None
        }
        res.append(mod_dict)
    return res

@router.get("/module/{module_id}", response_model=ModuleResponse)
def get_module_detail(
    module_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mod = db.query(CurriculumModule).filter(CurriculumModule.id == module_id).first()
    if not mod:
        raise HTTPException(status_code=404, detail="Modül bulunamadı.")
    
    prog = db.query(StudentProgress).filter(
        StudentProgress.student_id == current_user.id,
        StudentProgress.module_id == mod.id
    ).first()

    return {
        "id": mod.id,
        "level": mod.level,
        "module_type": mod.module_type,
        "title": mod.title,
        "subtitle": mod.subtitle,
        "description": mod.description,
        "content_json": mod.content_json,
        "order_index": mod.order_index,
        "estimated_minutes": mod.estimated_minutes,
        "created_at": mod.created_at,
        "completed": prog.completed if prog else False,
        "score": prog.score if prog else None
    }

@router.post("/submit")
def submit_module(
    submission: ModuleSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mod = db.query(CurriculumModule).filter(CurriculumModule.id == submission.module_id).first()
    if not mod:
        raise HTTPException(status_code=404, detail="Modül bulunamadı.")
    
    prog = db.query(StudentProgress).filter(
        StudentProgress.student_id == current_user.id,
        StudentProgress.module_id == mod.id
    ).first()

    xp_gain = 50 if submission.score >= 70 else 25

    if not prog:
        prog = StudentProgress(
            student_id=current_user.id,
            module_id=mod.id,
            completed=True,
            score=submission.score,
            attempts=1
        )
        db.add(prog)
    else:
        prog.completed = True
        prog.score = max(prog.score, submission.score)
        prog.attempts += 1
    
    current_user.xp_points += xp_gain
    db.commit()

    return {
        "message": "Tebrikler! Modül başarıyla tamamlandı.",
        "score": submission.score,
        "xp_earned": xp_gain,
        "new_total_xp": current_user.xp_points
    }
