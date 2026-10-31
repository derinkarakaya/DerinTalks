from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Flashcard, StudentFlashcardProgress, User
from ..schemas import FlashcardResponse, FlashcardReviewSubmit
from ..auth import get_current_user

router = APIRouter(prefix="/api/flashcards", tags=["Vocabulary Flashcards"])

@router.get("/list", response_model=List[FlashcardResponse])
def get_flashcards(
    level: Optional[str] = None,
    box: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Flashcard)
    if level and level != "ALL":
        query = query.filter(Flashcard.level == level.upper())
    
    flashcards = query.all()

    results = []
    for fc in flashcards:
        prog = db.query(StudentFlashcardProgress).filter(
            StudentFlashcardProgress.student_id == current_user.id,
            StudentFlashcardProgress.flashcard_id == fc.id
        ).first()

        current_box = prog.box if prog else 1
        if box and current_box != box:
            continue

        results.append({
            "id": fc.id,
            "level": fc.level,
            "word": fc.word,
            "phonetic": fc.phonetic,
            "translation": fc.translation,
            "part_of_speech": fc.part_of_speech,
            "example_en": fc.example_en,
            "example_tr": fc.example_tr,
            "category": fc.category,
            "box": current_box,
            "consecutive_correct": prog.consecutive_correct if prog else 0,
            "review_count": prog.review_count if prog else 0
        })

    return results

@router.get("/stats")
def get_flashcard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_cards = db.query(Flashcard).count()
    progress_records = db.query(StudentFlashcardProgress).filter(
        StudentFlashcardProgress.student_id == current_user.id
    ).all()

    box_counts = {1: 0, 2: 0, 3: 0, 4: 0}
    recorded_card_ids = set()

    for p in progress_records:
        b = min(max(p.box, 1), 4)
        box_counts[b] += 1
        recorded_card_ids.add(p.flashcard_id)

    # Any card not yet reviewed is considered Box 1 (Yeni)
    unreviewed = total_cards - len(recorded_card_ids)
    box_counts[1] += max(unreviewed, 0)

    return {
        "total_cards": total_cards,
        "box_1_new": box_counts[1],
        "box_2_learning": box_counts[2],
        "box_3_review": box_counts[3],
        "box_4_mastered": box_counts[4],
        "mastery_percentage": round((box_counts[4] / total_cards * 100), 1) if total_cards > 0 else 0
    }

@router.post("/review")
def review_flashcard(
    review: FlashcardReviewSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == review.flashcard_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Kelime kartı bulunamadı.")

    prog = db.query(StudentFlashcardProgress).filter(
        StudentFlashcardProgress.student_id == current_user.id,
        StudentFlashcardProgress.flashcard_id == card.id
    ).first()

    if not prog:
        prog = StudentFlashcardProgress(
            student_id=current_user.id,
            flashcard_id=card.id,
            box=1,
            consecutive_correct=0,
            review_count=0
        )
        db.add(prog)

    prog.review_count += 1
    prog.last_reviewed_at = datetime.utcnow()

    # Leitner Spaced Repetition logic
    if review.rating == "again":  # Zor / Hatırlanmadı
        prog.box = 1
        prog.consecutive_correct = 0
    elif review.rating == "good":  # Orta / İyi hatırlandı
        prog.consecutive_correct += 1
        prog.box = min(prog.box + 1, 4)
    elif review.rating == "easy":  # Kolay / Kusursuz
        prog.consecutive_correct += 2
        prog.box = min(prog.box + 2, 4)

    # Give small XP reward for vocabulary practice
    xp_earned = 10 if prog.box == 4 else 5
    current_user.xp_points += xp_earned

    db.commit()

    return {
        "message": "Kelime durumu güncellendi.",
        "card_id": card.id,
        "new_box": prog.box,
        "consecutive_correct": prog.consecutive_correct,
        "xp_earned": xp_earned
    }
