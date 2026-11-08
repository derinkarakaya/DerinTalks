from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "student"
    current_level: Optional[str] = "A1"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "student"
    current_level: Optional[str] = "A1"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = "Kullanıcı"
    role: Optional[str] = "student"
    current_level: Optional[str] = "A1"
    streak_days: Optional[int] = 1
    xp_points: Optional[int] = 120
    avatar_seed: Optional[str] = "Felix"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    message: str = "İşlem başarılı."
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ModuleBase(BaseModel):
    level: str
    module_type: str
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    content_json: str
    order_index: int = 1
    estimated_minutes: int = 15

class ModuleCreate(ModuleBase):
    pass

class ModuleResponse(ModuleBase):
    id: int
    created_at: datetime
    completed: Optional[bool] = False
    score: Optional[float] = None

    class Config:
        from_attributes = True

class ModuleSubmit(BaseModel):
    module_id: int
    score: float
    answers: Optional[Dict[str, Any]] = None

class FlashcardBase(BaseModel):
    level: str
    word: str
    phonetic: Optional[str] = None
    translation: str
    part_of_speech: str = "noun"
    example_en: str
    example_tr: str
    category: str = "Genel Kelimeler"

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(FlashcardBase):
    id: int
    box: Optional[int] = 1
    consecutive_correct: Optional[int] = 0
    review_count: Optional[int] = 0

    class Config:
        from_attributes = True

class FlashcardReviewSubmit(BaseModel):
    flashcard_id: int
    rating: str  # 'again' (hard), 'good' (medium), 'easy' (mastered)

class ExamQuestionBase(BaseModel):
    category: str = "Genel"
    question_text: str
    passage: Optional[str] = None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    option_e: Optional[str] = None
    correct_option: str
    explanation: Optional[str] = None

class ExamQuestionCreate(ExamQuestionBase):
    exam_type: str
    exam_id: Optional[int] = None

class ExamQuestionResponse(ExamQuestionBase):
    id: int
    exam_id: Optional[int] = None
    exam_type: str

    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    exam_type: str
    title: str
    description: Optional[str] = None
    duration_minutes: int = 60
    difficulty: str = "Orta"
    total_questions: int = 10

class ExamCreate(ExamBase):
    pass

class ExamResponse(ExamBase):
    id: int
    questions: Optional[List[ExamQuestionResponse]] = []
    created_at: datetime

    class Config:
        from_attributes = True

class ExamSubmit(BaseModel):
    exam_id: Optional[int] = None
    exam_type: str
    exam_title: str
    duration_taken_seconds: int
    answers: Dict[str, str]  # question_id -> selected_option

class ExamResultResponse(BaseModel):
    id: int
    exam_type: str
    exam_title: str
    total_questions: int
    correct_count: int
    incorrect_count: int
    empty_count: int
    score: float
    duration_taken_seconds: int
    completed_at: datetime

    class Config:
        from_attributes = True

class ScheduleItemBase(BaseModel):
    title: str
    day_name: str
    start_time: str
    end_time: str
    category: str = "canli_ders"
    instructor_name: str = "DerinTalks Eğitmeni"
    description: Optional[str] = None
    zoom_link: Optional[str] = None

class ScheduleItemCreate(ScheduleItemBase):
    pass

class ScheduleItemResponse(ScheduleItemBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
