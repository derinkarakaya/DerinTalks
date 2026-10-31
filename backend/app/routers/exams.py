import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Exam, ExamQuestion, StudentExamResult, User
from ..schemas import ExamResponse, ExamQuestionResponse, ExamSubmit, ExamResultResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/exams", tags=["Exam Preparation (YDS & LGS)"])

@router.get("/list", response_model=List[ExamResponse])
def get_exams(
    exam_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Exam)
    if exam_type:
        query = query.filter(Exam.exam_type == exam_type.upper())
    
    exams = query.all()
    results = []
    for ex in exams:
        results.append({
            "id": ex.id,
            "exam_type": ex.exam_type,
            "title": ex.title,
            "description": ex.description,
            "duration_minutes": ex.duration_minutes,
            "difficulty": ex.difficulty,
            "total_questions": len(ex.questions),
            "questions": ex.questions,
            "created_at": ex.created_at
        })
    return results

@router.get("/questions/practice", response_model=List[ExamQuestionResponse])
def get_practice_questions(
    exam_type: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ExamQuestion)
    if exam_type:
        query = query.filter(ExamQuestion.exam_type == exam_type.upper())
    if category and category != "ALL":
        query = query.filter(ExamQuestion.category == category)
    
    return query.all()

@router.get("/categories/{exam_type}")
def get_exam_categories(exam_type: str, db: Session = Depends(get_db)):
    categories = db.query(ExamQuestion.category).filter(
        ExamQuestion.exam_type == exam_type.upper()
    ).distinct().all()
    return [c[0] for c in categories if c[0]]

@router.get("/exam/{exam_id}", response_model=ExamResponse)
def get_exam_detail(exam_id: int, db: Session = Depends(get_db)):
    ex = db.query(Exam).filter(Exam.id == exam_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Sınav bulunamadı.")
    return {
        "id": ex.id,
        "exam_type": ex.exam_type,
        "title": ex.title,
        "description": ex.description,
        "duration_minutes": ex.duration_minutes,
        "difficulty": ex.difficulty,
        "total_questions": len(ex.questions),
        "questions": ex.questions,
        "created_at": ex.created_at
    }

@router.post("/submit", response_model=ExamResultResponse)
def submit_exam(
    submission: ExamSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch questions
    if submission.exam_id:
        questions = db.query(ExamQuestion).filter(ExamQuestion.exam_id == submission.exam_id).all()
    else:
        # Questions from practice solver
        q_ids = [int(k) for k in submission.answers.keys() if k.isdigit()]
        questions = db.query(ExamQuestion).filter(ExamQuestion.id.in_(q_ids)).all()

    total_q = len(questions)
    if total_q == 0:
        raise HTTPException(status_code=400, detail="Değerlendirilecek soru bulunamadı.")

    correct = 0
    incorrect = 0
    empty = 0

    for q in questions:
        user_ans = submission.answers.get(str(q.id))
        if not user_ans:
            empty += 1
        elif user_ans.strip().upper() == q.correct_option.strip().upper():
            correct += 1
        else:
            incorrect += 1

    # Standard score out of 100
    score = round((correct / total_q) * 100, 1)

    # Save student exam result
    result = StudentExamResult(
        student_id=current_user.id,
        exam_id=submission.exam_id,
        exam_type=submission.exam_type,
        exam_title=submission.exam_title,
        total_questions=total_q,
        correct_count=correct,
        incorrect_count=incorrect,
        empty_count=empty,
        score=score,
        duration_taken_seconds=submission.duration_taken_seconds,
        answers_json=json.dumps(submission.answers)
    )
    db.add(result)

    # Give student XP based on performance
    xp_gain = int(correct * 15)
    current_user.xp_points += xp_gain

    db.commit()
    db.refresh(result)

    return result

@router.get("/my-results")
def get_my_exam_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(StudentExamResult).filter(
        StudentExamResult.student_id == current_user.id
    ).order_by(StudentExamResult.completed_at.desc()).all()
    return results
