from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ScheduleItem, User
from ..schemas import ScheduleItemResponse, ScheduleItemCreate
from ..auth import get_current_user

router = APIRouter(prefix="/api/schedule", tags=["My Schedule / Calendar"])

@router.get("/list", response_model=List[ScheduleItemResponse])
def get_user_schedule(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve user's schedule items or shared active programs
    items = db.query(ScheduleItem).filter(
        ScheduleItem.user_id == current_user.id
    ).all()
    
    # If student has no custom schedule, fetch default student schedule items
    if not items and current_user.role == "student":
        student_demo = db.query(User).filter(User.email == "ogrenci@derintalks.com").first()
        if student_demo:
            items = db.query(ScheduleItem).filter(ScheduleItem.user_id == student_demo.id).all()

    return items

@router.post("/create", response_model=ScheduleItemResponse)
def create_schedule_item(
    item_in: ScheduleItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = ScheduleItem(
        user_id=current_user.id,
        title=item_in.title,
        day_name=item_in.day_name,
        start_time=item_in.start_time,
        end_time=item_in.end_time,
        category=item_in.category,
        instructor_name=item_in.instructor_name or "DerinTalks Eğitmeni",
        description=item_in.description,
        zoom_link=item_in.zoom_link
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_schedule_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(ScheduleItem).filter(
        ScheduleItem.id == item_id,
        ScheduleItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Program kaydı bulunamadı.")
    
    db.delete(item)
    db.commit()
    return {"message": "Program başarıyla silindi."}
