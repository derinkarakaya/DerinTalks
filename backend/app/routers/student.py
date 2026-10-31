from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, CurriculumModule, Flashcard, StudentProgress, StudentFlashcardProgress, StudentExamResult
from ..auth import get_current_user

router = APIRouter(prefix="/api/student", tags=["Student Dashboard"])

@router.get("/dashboard-summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Total curriculum modules
    total_modules = db.query(CurriculumModule).count()
    completed_modules = db.query(StudentProgress).filter(
        StudentProgress.student_id == current_user.id,
        StudentProgress.completed == True
    ).count()

    # Flashcard metrics
    total_flashcards = db.query(Flashcard).count()
    mastered_cards = db.query(StudentFlashcardProgress).filter(
        StudentFlashcardProgress.student_id == current_user.id,
        StudentFlashcardProgress.box == 4
    ).count()
    in_review_cards = db.query(StudentFlashcardProgress).filter(
        StudentFlashcardProgress.student_id == current_user.id,
        StudentFlashcardProgress.box.in_([2, 3])
    ).count()

    # Exam metrics
    exam_records = db.query(StudentExamResult).filter(
        StudentExamResult.student_id == current_user.id
    ).order_by(StudentExamResult.completed_at.desc()).all()
    avg_score = round(sum(r.score for r in exam_records) / len(exam_records), 1) if exam_records else 0

    # Level-by-level completion percentages
    levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
    level_stats = []
    for lvl in levels:
        lvl_total = db.query(CurriculumModule).filter(CurriculumModule.level == lvl).count()
        lvl_done = db.query(StudentProgress).join(CurriculumModule).filter(
            StudentProgress.student_id == current_user.id,
            CurriculumModule.level == lvl,
            StudentProgress.completed == True
        ).count()
        pct = round((lvl_done / lvl_total * 100), 1) if lvl_total > 0 else 0
        level_stats.append({
            "level": lvl,
            "total": lvl_total,
            "completed": lvl_done,
            "percentage": pct
        })

    return {
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "current_level": current_user.current_level,
            "streak_days": current_user.streak_days,
            "xp_points": current_user.xp_points
        },
        "curriculum": {
            "total_modules": total_modules,
            "completed_modules": completed_modules,
            "completion_percentage": round((completed_modules / total_modules * 100), 1) if total_modules > 0 else 0,
            "level_stats": level_stats
        },
        "flashcards": {
            "total_flashcards": total_flashcards,
            "mastered_cards": mastered_cards,
            "in_review_cards": in_review_cards,
            "new_cards": max(0, total_flashcards - mastered_cards - in_review_cards)
        },
        "exams": {
            "exams_completed": len(exam_records),
            "average_score": avg_score,
            "recent_results": [
                {
                    "title": r.exam_title,
                    "exam_type": r.exam_type,
                    "score": r.score,
                    "date": r.completed_at
                }
                for r in exam_records[:3]
            ]
        }
    }
