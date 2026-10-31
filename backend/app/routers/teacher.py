import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, CurriculumModule, Flashcard, ExamQuestion, Exam, StudentProgress, StudentFlashcardProgress, StudentExamResult
from ..schemas import (
    ModuleCreate, ModuleResponse,
    FlashcardCreate, FlashcardResponse,
    ExamQuestionCreate, ExamQuestionResponse
)
from ..auth import get_current_teacher

router = APIRouter(prefix="/api/teacher", tags=["Teacher CMS & Analytics"])

# ==================== 1. CURRICULUM CMS (Grammar, Reading, Tests, Games) ====================
@router.post("/modules", response_model=ModuleResponse)
def create_module(
    mod_in: ModuleCreate,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    mod = CurriculumModule(
        level=mod_in.level.upper(),
        module_type=mod_in.module_type,
        title=mod_in.title,
        subtitle=mod_in.subtitle,
        description=mod_in.description,
        content_json=mod_in.content_json,
        order_index=mod_in.order_index,
        estimated_minutes=mod_in.estimated_minutes
    )
    db.add(mod)
    db.commit()
    db.refresh(mod)
    return mod

@router.put("/modules/{module_id}", response_model=ModuleResponse)
def update_module(
    module_id: int,
    mod_in: ModuleCreate,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    mod = db.query(CurriculumModule).filter(CurriculumModule.id == module_id).first()
    if not mod:
        raise HTTPException(status_code=404, detail="Modül bulunamadı.")
    
    mod.level = mod_in.level.upper()
    mod.module_type = mod_in.module_type
    mod.title = mod_in.title
    mod.subtitle = mod_in.subtitle
    mod.description = mod_in.description
    mod.content_json = mod_in.content_json
    mod.order_index = mod_in.order_index
    mod.estimated_minutes = mod_in.estimated_minutes

    db.commit()
    db.refresh(mod)
    return mod

@router.delete("/modules/{module_id}")
def delete_module(
    module_id: int,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    mod = db.query(CurriculumModule).filter(CurriculumModule.id == module_id).first()
    if not mod:
        raise HTTPException(status_code=404, detail="Modül bulunamadı.")
    
    db.delete(mod)
    db.commit()
    return {"message": "Müfredat içeriği başarıyla silindi."}


# ==================== 2. FLASHCARD CMS ====================
@router.post("/flashcards", response_model=FlashcardResponse)
def create_flashcard(
    fc_in: FlashcardCreate,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    card = Flashcard(
        level=fc_in.level.upper(),
        word=fc_in.word,
        phonetic=fc_in.phonetic,
        translation=fc_in.translation,
        part_of_speech=fc_in.part_of_speech,
        example_en=fc_in.example_en,
        example_tr=fc_in.example_tr,
        category=fc_in.category
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

@router.put("/flashcards/{card_id}", response_model=FlashcardResponse)
def update_flashcard(
    card_id: int,
    fc_in: FlashcardCreate,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Kelime kartı bulunamadı.")
    
    card.level = fc_in.level.upper()
    card.word = fc_in.word
    card.phonetic = fc_in.phonetic
    card.translation = fc_in.translation
    card.part_of_speech = fc_in.part_of_speech
    card.example_en = fc_in.example_en
    card.example_tr = fc_in.example_tr
    card.category = fc_in.category

    db.commit()
    db.refresh(card)
    return card

@router.delete("/flashcards/{card_id}")
def delete_flashcard(
    card_id: int,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Kelime kartı bulunamadı.")
    
    db.delete(card)
    db.commit()
    return {"message": "Kelime kartı başarıyla silindi."}


# ==================== 3. EXAM & QUESTION CMS (YDS & LGS) ====================
@router.post("/exam-questions", response_model=ExamQuestionResponse)
def create_exam_question(
    q_in: ExamQuestionCreate,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    q = ExamQuestion(
        exam_id=q_in.exam_id,
        exam_type=q_in.exam_type.upper(),
        category=q_in.category,
        question_text=q_in.question_text,
        passage=q_in.passage,
        option_a=q_in.option_a,
        option_b=q_in.option_b,
        option_c=q_in.option_c,
        option_d=q_in.option_d,
        option_e=q_in.option_e,
        correct_option=q_in.correct_option.upper(),
        explanation=q_in.explanation
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

@router.put("/exam-questions/{question_id}", response_model=ExamQuestionResponse)
def update_exam_question(
    question_id: int,
    q_in: ExamQuestionCreate,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    q = db.query(ExamQuestion).filter(ExamQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Sınav sorusu bulunamadı.")
    
    q.exam_type = q_in.exam_type.upper()
    q.category = q_in.category
    q.question_text = q_in.question_text
    q.passage = q_in.passage
    q.option_a = q_in.option_a
    q.option_b = q_in.option_b
    q.option_c = q_in.option_c
    q.option_d = q_in.option_d
    q.option_e = q_in.option_e
    q.correct_option = q_in.correct_option.upper()
    q.explanation = q_in.explanation

    db.commit()
    db.refresh(q)
    return q

@router.delete("/exam-questions/{question_id}")
def delete_exam_question(
    question_id: int,
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    q = db.query(ExamQuestion).filter(ExamQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Sınav sorusu bulunamadı.")
    
    db.delete(q)
    db.commit()
    return {"message": "Soru başarıyla silindi."}


# ==================== 4. STUDENT PROGRESS TRACKING & ANALYTICS ====================
@router.get("/students-tracking")
def get_students_tracking(
    teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    students = db.query(User).filter(User.role == "student").all()
    total_curriculum_modules = db.query(CurriculumModule).count()
    total_flashcards = db.query(Flashcard).count()

    tracking_list = []
    for s in students:
        # 1. Modules progress
        completed_modules = db.query(StudentProgress).filter(
            StudentProgress.student_id == s.id,
            StudentProgress.completed == True
        ).count()
        mod_pct = round((completed_modules / total_curriculum_modules * 100), 1) if total_curriculum_modules > 0 else 0

        # 2. Flashcard mastery
        mastered_cards = db.query(StudentFlashcardProgress).filter(
            StudentFlashcardProgress.student_id == s.id,
            StudentFlashcardProgress.box == 4
        ).count()
        learning_cards = db.query(StudentFlashcardProgress).filter(
            StudentFlashcardProgress.student_id == s.id,
            StudentFlashcardProgress.box.in_([2, 3])
        ).count()

        # 3. Exam results
        exam_results = db.query(StudentExamResult).filter(
            StudentExamResult.student_id == s.id
        ).all()
        avg_score = round(sum(r.score for r in exam_results) / len(exam_results), 1) if exam_results else 0.0

        tracking_list.append({
            "student_id": s.id,
            "full_name": s.full_name,
            "email": s.email,
            "current_level": s.current_level,
            "streak_days": s.streak_days,
            "xp_points": s.xp_points,
            "completed_modules": completed_modules,
            "total_modules": total_curriculum_modules,
            "module_progress_pct": mod_pct,
            "mastered_flashcards": mastered_cards,
            "learning_flashcards": learning_cards,
            "total_flashcards": total_flashcards,
            "exams_taken": len(exam_results),
            "average_exam_score": avg_score,
            "last_active": s.created_at
        })

    return {
        "total_students": len(students),
        "total_curriculum_items": total_curriculum_modules,
        "students": tracking_list
    }
