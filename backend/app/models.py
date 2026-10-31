import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base, User


class CurriculumModule(Base):
    __tablename__ = "curriculum_modules"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(10), index=True, nullable=False)  # A1, A2, B1, B2, C1, C2
    module_type = Column(String(50), index=True, nullable=False)  # 'grammar', 'reading', 'test', 'game'
    title = Column(String(255), nullable=False)
    subtitle = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    content_json = Column(Text, nullable=False)  # JSON payload with details, questions, etc.
    order_index = Column(Integer, default=1)
    estimated_minutes = Column(Integer, default=15)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    progress = relationship("StudentProgress", back_populates="module", cascade="all, delete-orphan")


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("curriculum_modules.id"), nullable=False)
    completed = Column(Boolean, default=False)
    score = Column(Float, default=0.0)
    attempts = Column(Integer, default=1)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("User", back_populates="progress_records")
    module = relationship("CurriculumModule", back_populates="progress")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(10), index=True, nullable=False)  # A1, A2, B1, B2, C1, C2
    word = Column(String(255), nullable=False)
    phonetic = Column(String(100), nullable=True)
    translation = Column(String(255), nullable=False)
    part_of_speech = Column(String(50), default="noun")  # noun, verb, adj, adv, idiom
    example_en = Column(Text, nullable=False)
    example_tr = Column(Text, nullable=False)
    category = Column(String(100), default="Genel Kelimeler")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_records = relationship("StudentFlashcardProgress", back_populates="flashcard", cascade="all, delete-orphan")


class StudentFlashcardProgress(Base):
    __tablename__ = "student_flashcard_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"), nullable=False)
    box = Column(Integer, default=1)  # 1: Yeni, 2: Öğreniliyor, 3: Tekrar, 4: Öğrenildi (Mastered)
    consecutive_correct = Column(Integer, default=0)
    review_count = Column(Integer, default=0)
    last_reviewed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("User", back_populates="flashcard_progress")
    flashcard = relationship("Flashcard", back_populates="student_records")


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    exam_type = Column(String(50), index=True, nullable=False)  # 'YDS' or 'LGS'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=60)
    difficulty = Column(String(50), default="Orta")  # Kolay, Orta, İleri
    total_questions = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan")
    results = relationship("StudentExamResult", back_populates="exam", cascade="all, delete-orphan")


class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=True)
    exam_type = Column(String(50), index=True, nullable=False)  # 'YDS' or 'LGS'
    category = Column(String(100), default="Genel")
    question_text = Column(Text, nullable=False)
    passage = Column(Text, nullable=True)  # Optional reading passage for paragraph questions
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    option_e = Column(Text, nullable=True)  # None for LGS (4 options)
    correct_option = Column(String(5), nullable=False)  # 'A', 'B', 'C', 'D', 'E'
    explanation = Column(Text, nullable=True)  # Detailed Turkish explanation

    exam = relationship("Exam", back_populates="questions")


class StudentExamResult(Base):
    __tablename__ = "student_exam_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=True)
    exam_type = Column(String(50), nullable=False)  # 'YDS' or 'LGS'
    exam_title = Column(String(255), nullable=False)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    empty_count = Column(Integer, default=0)
    score = Column(Float, default=0.0)
    duration_taken_seconds = Column(Integer, default=0)
    answers_json = Column(Text, nullable=True)  # student answers map
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("User", back_populates="exam_results")
    exam = relationship("Exam", back_populates="results")


class ScheduleItem(Base):
    __tablename__ = "schedule_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    day_name = Column(String(50), nullable=False)  # Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar
    start_time = Column(String(10), nullable=False)  # "18:00"
    end_time = Column(String(10), nullable=False)    # "19:30"
    category = Column(String(50), default="canli_ders")  # canli_ders, speaking, etut, tekrar
    instructor_name = Column(String(100), default="DerinTalks Eğitmeni")
    description = Column(String(255), nullable=True)
    zoom_link = Column(String(255), nullable=True)

    user = relationship("User", back_populates="schedule_items")

# User modeline ait ilişkisel alanlar
User.progress_records = relationship("StudentProgress", back_populates="student", cascade="all, delete-orphan")
User.flashcard_progress = relationship("StudentFlashcardProgress", back_populates="student", cascade="all, delete-orphan")
User.exam_results = relationship("StudentExamResult", back_populates="student", cascade="all, delete-orphan")
User.schedule_items = relationship("ScheduleItem", back_populates="user", cascade="all, delete-orphan")
