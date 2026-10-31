import json
from sqlalchemy.orm import Session
from .models import User, CurriculumModule, Flashcard, Exam, ExamQuestion, ScheduleItem, StudentProgress, StudentFlashcardProgress, StudentExamResult
from .auth import hash_password

def seed_database(db: Session, force: bool = False):
    # Check if database is already seeded
    if not force and db.query(User).filter(User.email == "ogrenci@derintalks.com").first():
        return

    if force:
        db.query(StudentProgress).delete()
        db.query(StudentFlashcardProgress).delete()
        db.query(StudentExamResult).delete()
        db.query(ScheduleItem).delete()
        db.query(ExamQuestion).delete()
        db.query(Exam).delete()
        db.query(Flashcard).delete()
        db.query(CurriculumModule).delete()
        db.query(User).delete()
        db.commit()

    print("Seeding DerinTalks database with rich curriculum, exams, flashcards, and users...")

    # 1. Users
    student = User(
        email="ogrenci@derintalks.com",
        password_hash=hash_password("123456"),
        full_name="Can Demir",
        role="student",
        current_level="B1",
        streak_days=5,
        xp_points=840,
        avatar_seed="Can"
    )
    
    teacher = User(
        email="ogretmen@derintalks.com",
        password_hash=hash_password("123456"),
        full_name="Ayşe Kaya",
        role="teacher",
        current_level="C2",
        streak_days=18,
        xp_points=2400,
        avatar_seed="Ayse"
    )

    db.add(student)
    db.add(teacher)
    db.flush()

    # 2. Curriculum Modules for A1 to C2
    modules = [
        # === A1 LEVEL ===
        {
            "level": "A1",
            "module_type": "grammar",
            "title": "To Be Fiili & Present Simple Temelleri",
            "subtitle": "Am / Is / Are kullanımı ve günlük rutin cümleleri",
            "description": "İngilizcenin en temel yapı taşı olan 'to be' yardımcı fiilini ve geniş zamanı günlük diyaloglarla kavrayın.",
            "estimated_minutes": 15,
            "order_index": 1,
            "content_json": json.dumps({
                "explanation": "İngilizcede durum bildirmek ve geniş zamanda rutinlerimizi anlatmak için 'To Be' ve 'Present Simple' kullanılır. İsim ve sıfat cümlelerinde 'am/is/are', eylem cümlelerinde ise fiilin yalın hali (he/she/it için -s takısı) devreye girer.",
                "rules": [
                    {"rule": "I + am | He / She / It + is | You / We / They + are", "example": "I am a student. / She is happy."},
                    {"rule": "Geniş Zaman (Present Simple): He/She/It fiile -s, -es alır.", "example": "He drinks tea every morning."},
                    {"rule": "Soru yapısı: Am/Is/Are başa gelir veya Do/Does kullanılır.", "example": "Are you ready? / Do you like coffee?"}
                ],
                "dialogue": [
                    {"speaker": "Elif", "text": "Hello! I am Elif. Where are you from?"},
                    {"speaker": "David", "text": "Hi Elif! I am from London. Do you live in Istanbul?"},
                    {"speaker": "Elif", "text": "Yes, I live in Kadıköy. I study English every day!"}
                ],
                "practice_quiz": [
                    {
                        "question": "Sarah ___ (be) a talented doctor.",
                        "options": ["am", "is", "are", "be"],
                        "answer": "is",
                        "explanation": "Sarah tekil 3. şahıs (She) olduğu için 'is' kullanılır."
                    },
                    {
                        "question": "They ___ play football on Sundays.",
                        "options": ["doesn't", "don't", "isn't", "aren't"],
                        "answer": "don't",
                        "explanation": "Geniş zamanda 'They' öznesi ile olumsuzluk eki 'don't' olur."
                    }
                ]
            })
        },
        {
            "level": "A1",
            "module_type": "reading",
            "title": "My Daily Routine in London",
            "subtitle": "Basit zaman kalıplarıyla kısa bir gün anlatımı",
            "description": "Günlük alışkanlıkları ve saat ifadelerini pekiştiren akıcı bir okuma parçası.",
            "estimated_minutes": 12,
            "order_index": 2,
            "content_json": json.dumps({
                "passage": "My name is Jack. I wake up at 7:00 AM every weekday. First, I wash my face and brush my teeth. Then, I prepare a quick breakfast with eggs and toast. I leave home at 8:15 AM and take the red bus to university. In the afternoon, I meet my friends at the campus library. In the evening, I usually cook pasta and read a book before going to sleep at 11:00 PM.",
                "vocabulary_hints": [
                    {"word": "wake up", "tr": "uyanmak"},
                    {"word": "brush teeth", "tr": "diş fırçalamak"},
                    {"word": "leave home", "tr": "evden çıkmak"},
                    {"word": "campus library", "tr": "kampüs kütüphanesi"}
                ],
                "questions": [
                    {
                        "question": "What time does Jack wake up?",
                        "options": ["At 6:30 AM", "At 7:00 AM", "At 8:15 AM", "At 11:00 PM"],
                        "answer": "At 7:00 AM",
                        "explanation": "Metinde 'I wake up at 7:00 AM every weekday' ifadesi geçmektedir."
                    },
                    {
                        "question": "How does he travel to university?",
                        "options": ["By bicycle", "By subway train", "By red bus", "On foot"],
                        "answer": "By red bus",
                        "explanation": "'I take the red bus to university' cümlesinden otobüsle gittiği anlaşılır."
                    }
                ]
            })
        },
        {
            "level": "A1",
            "module_type": "test",
            "title": "A1 Seviye Değerlendirme Testi",
            "subtitle": "Temel kelime ve gramer bilginizi ölçün",
            "description": "A1 konularını kapsayan 5 soruluk mini seviye testi.",
            "estimated_minutes": 10,
            "order_index": 3,
            "content_json": json.dumps({
                "questions": [
                    {
                        "id": 1,
                        "question": "Look at ___ birds in the sky over there!",
                        "options": ["this", "that", "these", "those"],
                        "answer": "those",
                        "explanation": "Uzaktaki çoğul nesneler için 'those' kullanılır."
                    },
                    {
                        "id": 2,
                        "question": "There ___ two laptops on the desk.",
                        "options": ["is", "are", "have", "be"],
                        "answer": "are",
                        "explanation": "'Two laptops' çoğul olduğu için 'There are' doğru kullanımdır."
                    },
                    {
                        "id": 3,
                        "question": "My sister's son is my ___.",
                        "options": ["cousin", "nephew", "niece", "uncle"],
                        "answer": "nephew",
                        "explanation": "Kız kardeşin erkek çocuğu yeğen (nephew) kelimesi ile ifade edilir."
                    }
                ]
            })
        },
        {
            "level": "A1",
            "module_type": "game",
            "title": "Kelime Eşleştirmece (A1 Basics)",
            "subtitle": "Kelimeleri Türkçe karşılıklarıyla eşleştirin",
            "description": "Zamana karşı yarışarak kartları doğru anlamlarıyla eşleştirin ve puan toplayın.",
            "estimated_minutes": 8,
            "order_index": 4,
            "content_json": json.dumps({
                "game_mode": "matching",
                "pairs": [
                    {"en": "Morning", "tr": "Sabah"},
                    {"en": "Breakfast", "tr": "Kahvaltı"},
                    {"en": "Library", "tr": "Kütüphane"},
                    {"en": "Doctor", "tr": "Doktor"},
                    {"en": "Weather", "tr": "Hava Durumu"},
                    {"en": "Window", "tr": "Pencere"}
                ]
            })
        },
        {
            "level": "A1",
            "module_type": "grammar",
            "title": "Sahiplik Sıfatları & Have Got / Has Got",
            "subtitle": "My, your, his, her ve sahip olunan nesneleri ifade etme",
            "description": "İngilizcede aile üyelerini, eşyaları ve fiziksel özellikleri sahiplik kalıplarıyla anlatmayı öğrenin.",
            "estimated_minutes": 15,
            "order_index": 5,
            "content_json": json.dumps({
                "explanation": "Sahiplik bildirmek için iyelik sıfatları (my, your, his, her, its, our, their) veya 'have got / has got' kalıbı kullanılır. I/You/We/They ile 'have got', He/She/It ile 'has got' tercih edilir.",
                "rules": [
                    {"rule": "I have got / She has got a car", "example": "She has got blue eyes and brown hair."},
                    {"rule": "İyelik Sıfatları: my bag, his brother, our school", "example": "This is our classroom."},
                    {"rule": "Olumsuz: haven't got / hasn't got", "example": "I haven't got a pet."}
                ],
                "dialogue": [
                    {"speaker": "Can", "text": "Have you got a pencil, Zeynep?"},
                    {"speaker": "Zeynep", "text": "Yes, I have got two pencils in my pencil case. Here you go!"},
                    {"speaker": "Can", "text": "Thank you! What about an eraser?"},
                    {"speaker": "Zeynep", "text": "No, I haven't got an eraser, sorry."}
                ],
                "practice_quiz": [
                    {
                        "question": "Tom ___ got a new smartphone.",
                        "options": ["have", "has", "is", "are"],
                        "answer": "has",
                        "explanation": "Tom (He) tekil özne olduğu için 'has got' kullanılır."
                    },
                    {
                        "question": "We love ___ new English teacher.",
                        "options": ["our", "we", "us", "ours"],
                        "answer": "our",
                        "explanation": "İsimden (teacher) önce iyelik sıfatı (our) gelir."
                    }
                ]
            })
        },
        {
            "level": "A1",
            "module_type": "grammar",
            "title": "There is / There are & Yer Edatları",
            "subtitle": "Bir ortamdaki nesnelerin varlığını ve yerini belirtme",
            "description": "Odadaki eşyaları, mekanları 'there is/are' ve 'in, on, under, between' ile konumlandırın.",
            "estimated_minutes": 14,
            "order_index": 6,
            "content_json": json.dumps({
                "explanation": "Tekil nesneler ve sayılamayan isimler için 'There is', çoğul nesneler için 'There are' kullanılır. Yer edatları (in, on, under, next to, between, behind) nesnelerin nerede olduğunu tam olarak belirtir.",
                "rules": [
                    {"rule": "There is + tekil isim: There is a book on the table.", "example": "There is a cat under the chair."},
                    {"rule": "There are + çoğul isim: There are three apples in the basket.", "example": "There are many students in the garden."},
                    {"rule": "Soru hali: Is there ...? / Are there ...?", "example": "Is there a hospital near here? Yes, there is."}
                ],
                "dialogue": [
                    {"speaker": "Tourist", "text": "Excuse me, is there a pharmacy near here?"},
                    {"speaker": "Local", "text": "Yes, there is one next to the bank, right between the cafe and the post office."},
                    {"speaker": "Tourist", "text": "Are there any ATMs on this street?"},
                    {"speaker": "Local", "text": "Yes, there are two ATMs across the road."}
                ],
                "practice_quiz": [
                    {
                        "question": "There ___ some fresh milk in the fridge.",
                        "options": ["is", "are", "have", "were"],
                        "answer": "is",
                        "explanation": "Milk sayılamayan bir isim olduğu için tekil kabul edilir ve 'There is' kullanılır."
                    },
                    {
                        "question": "The keys are ___ the table, next to the laptop.",
                        "options": ["on", "in", "between", "underneath"],
                        "answer": "on",
                        "explanation": "Masa yüzeyinde bulunan nesneler için 'on' kullanılır."
                    }
                ]
            })
        },

        # === A2 LEVEL ===
        {
            "level": "A2",
            "module_type": "grammar",
            "title": "Past Simple & Düzenli/Düzensiz Fiiller",
            "subtitle": "Geçmiş zaman yapıları, -ed takısı ve yaygın 2. haller",
            "description": "Dün, geçen hafta ve geçmişte yaşanan anıları doğru aktarma sanatı.",
            "estimated_minutes": 18,
            "order_index": 1,
            "content_json": json.dumps({
                "explanation": "Geçmişte tamamlanmış eylemleri anlatırken Past Simple (V2) kullanırız. Düzenli fiiller '-ed' alırken, düzensiz fiiller (go->went, buy->bought) şekil değiştirir. Olumsuz ve soru cümlelerinde 'didn't + V1' kullanılır.",
                "rules": [
                    {"rule": "Düzenli Fiiller: play -> played, watch -> watched", "example": "We watched an amazing film yesterday."},
                    {"rule": "Düzensiz Fiiller: see -> saw, make -> made", "example": "I saw your teacher at the station."},
                    {"rule": "Soru ve Olumsuz: Did you ...? / I didn't ... (Fiil 1. hale döner)", "example": "Did you go to school? No, I didn't go."}
                ],
                "practice_quiz": [
                    {
                        "question": "We ___ (buy) a new car two weeks ago.",
                        "options": ["buyed", "bought", "have bought", "buying"],
                        "answer": "bought",
                        "explanation": "'Buy' düzensiz bir fiildir ve 2. hali 'bought' şeklindedir."
                    },
                    {
                        "question": "She ___ understand the instructions yesterday.",
                        "options": ["didn't", "doesn't", "wasn't", "hasn't"],
                        "answer": "didn't",
                        "explanation": "Past Simple olumsuz cümlede 'didn't' kullanılır."
                    }
                ]
            })
        },
        {
            "level": "A2",
            "module_type": "reading",
            "title": "A Trip to Cappadocia",
            "subtitle": "Kapadokya balon turu ve peri bacaları gezisi",
            "description": "Geçmiş zaman kalıplarıyla yazılmış eğlenceli bir seyahat yazısı.",
            "estimated_minutes": 14,
            "order_index": 2,
            "content_json": json.dumps({
                "passage": "Last summer, Maria and Thomas travelled to Cappadocia. They stayed in a traditional cave hotel in Göreme. Early on Saturday morning, they woke up at 5:00 AM to see the hot air balloons. The sky was filled with colorful balloons floating gently over the fairy chimneys. Thomas took hundreds of photos. Afterwards, they enjoyed a rich Turkish breakfast with olives, cheese, and fresh simit. It was an unforgettable weekend.",
                "vocabulary_hints": [
                    {"word": "cave hotel", "tr": "mağara oteli"},
                    {"word": "fairy chimneys", "tr": "peri bacaları"},
                    {"word": "floating gently", "tr": "nazikçe süzülen"},
                    {"word": "unforgettable", "tr": "unutulmaz"}
                ],
                "questions": [
                    {
                        "question": "Where did Maria and Thomas stay?",
                        "options": ["In a seaside resort", "In a modern high-rise", "In a cave hotel", "In a tent"],
                        "answer": "In a cave hotel",
                        "explanation": "Metinde 'They stayed in a traditional cave hotel in Göreme' belirtilmektedir."
                    },
                    {
                        "question": "Why did they wake up early at 5:00 AM?",
                        "options": ["To catch a flight", "To see hot air balloons", "To go hiking", "To attend a meeting"],
                        "answer": "To see hot air balloons",
                        "explanation": "'they woke up at 5:00 AM to see the hot air balloons' cümlesi doğrudan açıklar."
                    }
                ]
            })
        },
        {
            "level": "A2",
            "module_type": "test",
            "title": "A2 Gramer ve Zamanlar Testi",
            "subtitle": "Past Simple & Comparatives / Superlatives",
            "description": "Zamanlar ve sıfat karşılaştırmaları üzerine pratik test.",
            "estimated_minutes": 10,
            "order_index": 3,
            "content_json": json.dumps({
                "questions": [
                    {
                        "id": 1,
                        "question": "Mount Everest is ___ mountain in the world.",
                        "options": ["highest", "the highest", "higher than", "more high"],
                        "answer": "the highest",
                        "explanation": "En üstünlük (Superlative) derecesinde 'the highest' kullanılır."
                    },
                    {
                        "id": 2,
                        "question": "I ___ to Italy three years ago.",
                        "options": ["went", "gone", "have gone", "go"],
                        "answer": "went",
                        "explanation": "'three years ago' geçmiş zaman zarfıdır, 'went' gerekir."
                    }
                ]
            })
        },
        {
            "level": "A2",
            "module_type": "game",
            "title": "Kelime Çözücü (Word Scramble)",
            "subtitle": "Karışık harflerden anlamlı kelimeleri türetin",
            "description": "Harfleri doğru sıraya dizerek İngilizce kelimeleri bulun.",
            "estimated_minutes": 8,
            "order_index": 4,
            "content_json": json.dumps({
                "game_mode": "scramble",
                "words": [
                    {"scrambled": "R U O N J E Y", "word": "JOURNEY", "clue": "Seyahat, yolculuk"},
                    {"scrambled": "H A E C P E R T", "word": "CHEAPER", "clue": "Daha ucuz (karşılaştırma)"},
                    {"scrambled": "S D I N T A T", "word": "DISTANT", "clue": "Uzak, mesafeli"},
                    {"scrambled": "C R O W D E D", "word": "CROWDED", "clue": "Kalabalık"}
                ]
            })
        },
        {
            "level": "A2",
            "module_type": "grammar",
            "title": "Gelecek Planları: 'Be Going To' & Present Continuous",
            "subtitle": "Önceden planlanmış niyetler ve kesin randevular",
            "description": "Hafta sonu planları, tatil programları ve gelecekte yapılması kararlaştırılmış aktiviteleri doğru zaman kalıplarıyla ifade edin.",
            "estimated_minutes": 16,
            "order_index": 5,
            "content_json": json.dumps({
                "explanation": "Geleceğe yönelik önceden verilmiş kararlar ve güçlü belirtisi olan tahminler için 'be going to + V1' kullanılır. Randevulaşılmış, biletleri alınmış kesin organizasyonlar içinse Şimdiki Zaman (Present Continuous) kullanılır.",
                "rules": [
                    {"rule": "Niyet & Plan: am/is/are going to + V1", "example": "I am going to study medicine at university."},
                    {"rule": "Gözle görülür kanıt: Look at those clouds! It is going to rain.", "example": "Be careful, you are going to drop that plate!"},
                    {"rule": "Kesin Randevu: am/is/are + V-ing", "example": "I am flying to Berlin tomorrow morning."}
                ],
                "dialogue": [
                    {"speaker": "Mert", "text": "What are you doing this weekend, Selin?"},
                    {"speaker": "Selin", "text": "I am meeting my cousin on Saturday, and we are going to watch a play at the theater."},
                    {"speaker": "Mert", "text": "That sounds great! Are you going to buy the tickets online?"},
                    {"speaker": "Selin", "text": "I already bought them yesterday!"}
                ],
                "practice_quiz": [
                    {
                        "question": "Look at the dark clouds in the sky! It ___ rain.",
                        "options": ["is going to", "will", "rains", "rained"],
                        "answer": "is going to",
                        "explanation": "Ortamda bariz bir kanıt (dark clouds) olduğunda 'be going to' tercih edilir."
                    },
                    {
                        "question": "We ___ tennis with Alex tomorrow at 4 PM; we booked the court.",
                        "options": ["are playing", "played", "play", "have played"],
                        "answer": "are playing",
                        "explanation": "Kesin organizasyon ve rezervasyon yapıldığı için Present Continuous kullanılır."
                    }
                ]
            })
        },
        {
            "level": "A2",
            "module_type": "grammar",
            "title": "Karşılaştırma Sıfatları: Comparatives & Superlatives",
            "subtitle": "İki veya daha fazla nesneyi, kişiyi ve mekanı kıyaslama",
            "description": "Sıfatların hece yapılarına göre -er, more, the -est ve the most kurallarını öğrenin.",
            "estimated_minutes": 18,
            "order_index": 6,
            "content_json": json.dumps({
                "explanation": "İki şeyi kıyaslarken Comparative (kısa sıfatlara '-er than', uzun sıfatlara 'more ... than'), en üstün olanı seçerken Superlative ('the -est', 'the most ...') kullanılır. Düzensiz sıfatlar: good -> better -> the best, bad -> worse -> the worst.",
                "rules": [
                    {"rule": "Kısa sıfatlar: fast -> faster than -> the fastest", "example": "A cheetah is faster than a lion."},
                    {"rule": "Uzun sıfatlar: expensive -> more expensive than -> the most expensive", "example": "This hotel is the most expensive in the city."},
                    {"rule": "Düzensizler: good/better/best | bad/worse/worst", "example": "Health is more important than wealth."}
                ],
                "dialogue": [
                    {"speaker": "Ali", "text": "Which city is bigger, Istanbul or Ankara?"},
                    {"speaker": "Burak", "text": "Istanbul is much bigger and more crowded than Ankara."},
                    {"speaker": "Ali", "text": "And which one is the oldest?"},
                    {"speaker": "Burak", "text": "Istanbul has one of the richest and oldest histories in the world."}
                ],
                "practice_quiz": [
                    {
                        "question": "This test was ___ than the one we took last week.",
                        "options": ["more difficult", "difficult", "most difficult", "as difficult"],
                        "answer": "more difficult",
                        "explanation": "İki sınav kıyaslandığı ve 'difficult' çok heceli olduğu için 'more difficult than' yapısı kullanılır."
                    },
                    {
                        "question": "Tokyo is one of ___ populated cities on earth.",
                        "options": ["the most", "more", "most", "the more"],
                        "answer": "the most",
                        "explanation": "Superlative yapısında 'the most + uzun sıfat' kullanılır."
                    }
                ]
            })
        },

        # === B1 LEVEL ===
        {
            "level": "B1",
            "module_type": "grammar",
            "title": "Present Perfect vs Past Simple & Modals",
            "subtitle": "Deneyimler, 'have been' ve zorunluluk kipleri (must, have to, should)",
            "description": "Hayat tecrübelerini aktarmak ve geçmiş ile günümüz arasındaki köprüleri kurmak.",
            "estimated_minutes": 20,
            "order_index": 1,
            "content_json": json.dumps({
                "explanation": "Present Perfect Tense (have/has + V3) geçmişte başlamış veya zamanı belirtilmemiş tecrübeleri bugünle ilişkilendirir. Eğer eylemin tam tarihi belliyse (yesterday, in 2020) Past Simple kullanılır.",
                "rules": [
                    {"rule": "Zaman belirtilmemiş tecrübe: Have you ever visited Tokyo?", "example": "Yes, I have visited it twice."},
                    {"rule": "Tam zaman belirtilmiş: When did you visit?", "example": "I visited Tokyo in 2022."},
                    {"rule": "Modals: Must / Have to (zorunluluk), Should (tavsiye)", "example": "You should drink more water before your run."}
                ],
                "practice_quiz": [
                    {
                        "question": "I ___ in Izmir since 2018.",
                        "options": ["lived", "have lived", "am living", "was living"],
                        "answer": "have lived",
                        "explanation": "'Since 2018' başlangıç noktası verir ve eylem sürdüğü için Present Perfect kullanılır."
                    },
                    {
                        "question": "Passengers ___ fasten their seatbelts during turbulence.",
                        "options": ["should", "must", "might", "could"],
                        "answer": "must",
                        "explanation": "Uçuş emniyeti kuralları kesin zorunluluk (must) gerektirir."
                    }
                ]
            })
        },
        {
            "level": "B1",
            "module_type": "reading",
            "title": "The Rise of Remote Work",
            "subtitle": "Dijital göçebelik ve modern çalışma kültürü",
            "description": "Evden çalışma modelinin avantajları ve karşılaşılan iletişim zorlukları.",
            "estimated_minutes": 15,
            "order_index": 2,
            "content_json": json.dumps({
                "passage": "Over the past few years, remote work has transformed the global economy. Thousands of professionals now work from their living rooms, coastal towns, or co-working spaces across different continents. Proponents argue that flexible hours lead to higher productivity and a better work-life balance. However, critics point out the risk of social isolation and blurred boundaries between professional duties and private life. To thrive, remote employees must develop strong self-discipline and effective digital communication skills.",
                "vocabulary_hints": [
                    {"word": "proponents", "tr": "savunucular, taraftarlar"},
                    {"word": "productivity", "tr": "üretkenlik, verimlilik"},
                    {"word": "social isolation", "tr": "sosyal izolasyon / yalnızlaşma"},
                    {"word": "blurred boundaries", "tr": "bulanıklaşan sınırlar"}
                ],
                "questions": [
                    {
                        "question": "What is one major advantage highlighted by supporters of remote work?",
                        "options": ["Cheaper office rents for governments", "Better work-life balance and productivity", "No need to use computers", "Fewer taxes"],
                        "answer": "Better work-life balance and productivity",
                        "explanation": "'flexible hours lead to higher productivity and a better work-life balance' cümlesi bunu açıklar."
                    },
                    {
                        "question": "What is a potential risk mentioned in the text?",
                        "options": ["Lack of internet worldwide", "Excessive physical exercise", "Social isolation and blurred boundaries", "Too much sleep"],
                        "answer": "Social isolation and blurred boundaries",
                        "explanation": "'critics point out the risk of social isolation and blurred boundaries' ifadesi yer almaktadır."
                    }
                ]
            })
        },
        {
            "level": "B1",
            "module_type": "test",
            "title": "B1 İleri Seviye Yetkinlik Testi",
            "subtitle": "Bağlaçlar, zaman uyumu ve dolaylı anlatım",
            "description": "Orta düzey dil yeterliliğinizi kanıtlayacak kapsamlı sorular.",
            "estimated_minutes": 15,
            "order_index": 3,
            "content_json": json.dumps({
                "questions": [
                    {
                        "id": 1,
                        "question": "Although it was raining heavily, we ___ for our scheduled hike.",
                        "options": ["set off", "gave up", "put off", "called off"],
                        "answer": "set off",
                        "explanation": "'Although' (rağmen) zıtlık bildirir; yağmura rağmen yola çıktık (set off)."
                    },
                    {
                        "id": 2,
                        "question": "If you ___ early tomorrow, we will catch the express train.",
                        "options": ["will wake up", "wake up", "woke up", "had woken up"],
                        "answer": "wake up",
                        "explanation": "First Conditional yapısında 'if' cümleciğinde geniş zaman (Present Simple) kullanılır."
                    }
                ]
            })
        },
        {
            "level": "B1",
            "module_type": "game",
            "title": "Hızlı Karar: Doğru mu Yanlış mı?",
            "subtitle": "Kelimeler ve eş anlamlıları hızlıca değerlendirin",
            "description": "Verilen cümlenin veya eş anlamlı eşleşmenin doğruluğunu saniyeler içinde onaylayın.",
            "estimated_minutes": 8,
            "order_index": 4,
            "content_json": json.dumps({
                "game_mode": "true_false",
                "challenges": [
                    {"statement": "'Accurate' kelimesi 'Doğru / Hatasız' anlamına gelir.", "is_true": True, "fact": "Accurate = correct and precise."},
                    {"statement": "'Postpone' kelimesi 'Hızlandırmak' demektir.", "is_true": False, "fact": "Postpone = ertelemek (delay/put off)."},
                    {"statement": "'Crucial' hayati derecede önemli demektir.", "is_true": True, "fact": "Crucial = extremely important/vital."},
                    {"statement": "'Reluctant' istekli ve hevesli demektir.", "is_true": False, "fact": "Reluctant = isteksiz, gönülsüz (unwilling)."}
                ]
            })
        },
        {
            "level": "B1",
            "module_type": "grammar",
            "title": "Modal Yardımcı Fiiller: Can, Must, Should, Have To",
            "subtitle": "Zorunluluk, yasak, tavsiye ve ihtimal kipleri",
            "description": "Gündelik ve resmi iletişimde kuralları, tavsiyeleri ve kişisel zorunlulukları ayırt etme rehberi.",
            "estimated_minutes": 20,
            "order_index": 5,
            "content_json": json.dumps({
                "explanation": "Dıştan gelen kural ve kanunlar için 'have to', içsel zorunluluk için 'must', yasaklar için 'mustn't', tavsiyeler için 'should / ought to', yetenek veya izin için 'can / could' kullanılır.",
                "rules": [
                    {"rule": "Tavsiye: You should see a dentist if your tooth hurts.", "example": "You shouldn't stay up so late."},
                    {"rule": "Dış kural: Drivers have to wear seatbelts by law.", "example": "Students have to wear uniforms at this school."},
                    {"rule": "Zorunluluk olmaması: don't have to (yapmana gerek yok)", "example": "Tomorrow is Sunday, so I don't have to wake up early."}
                ],
                "dialogue": [
                    {"speaker": "Doctor", "text": "You have a severe throat infection. You must rest for three days."},
                    {"speaker": "Patient", "text": "Do I have to take antibiotics?"},
                    {"speaker": "Doctor", "text": "Yes, and you should drink plenty of warm water. You mustn't drink cold beverages."}
                ],
                "practice_quiz": [
                    {
                        "question": "You ___ smoke in hospitals; it is strictly forbidden.",
                        "options": ["mustn't", "don't have to", "should", "can"],
                        "answer": "mustn't",
                        "explanation": "Kesin yasak bildiren durumlarda 'mustn't' kullanılır."
                    },
                    {
                        "question": "You ___ buy a ticket now; admission is free today.",
                        "options": ["don't have to", "mustn't", "shouldn't", "can't"],
                        "answer": "don't have to",
                        "explanation": "Gerek yok / serbest anlamında 'don't have to' kullanılır."
                    }
                ]
            })
        },
        {
            "level": "B1",
            "module_type": "grammar",
            "title": "Koşul Cümleleri: First & Second Conditionals (If Clauses)",
            "subtitle": "Geleceğe dair olasılıklar ve şimdiki zamana dair hayali durumlar",
            "description": "Type 1 ile gerçekçi koşulları, Type 2 ile hayali/varsayımsal senaryoları kurmayı öğrenin.",
            "estimated_minutes": 20,
            "order_index": 6,
            "content_json": json.dumps({
                "explanation": "Type 1 (If + Present Simple, will + V1) gelecekte gerçekleşmesi muhtemel durumları anlatır. Type 2 (If + Past Simple, would + V1) şimdiki zamanda gerçek olmayan veya hayali senaryoları (unreal present) anlatır. Type 2'de 'to be' fiili genellikle tüm öznelerle 'were' olur.",
                "rules": [
                    {"rule": "Type 1 (Gerçekçi): If it rains tomorrow, we will stay at home.", "example": "If you study hard, you will pass the YDS exam."},
                    {"rule": "Type 2 (Hayali): If I had a million dollars, I would travel around the world.", "example": "If I were you, I would consult a professional."}
                ],
                "dialogue": [
                    {"speaker": "Cem", "text": "What will you do if you get accepted to Oxford?"},
                    {"speaker": "Derya", "text": "If I get the scholarship, I will move to the UK in September!"},
                    {"speaker": "Cem", "text": "If I were in your shoes, I would celebrate all week!"}
                ],
                "practice_quiz": [
                    {
                        "question": "If I ___ more free time, I would learn Spanish.",
                        "options": ["had", "have", "will have", "am having"],
                        "answer": "had",
                        "explanation": "İkinci cümlede 'would learn' olduğu için Type 2 koşul cümlesidir ve 'had' gerektirir."
                    },
                    {
                        "question": "If the weather ___ fine this weekend, we will go on a picnic.",
                        "options": ["is", "was", "will be", "were"],
                        "answer": "is",
                        "explanation": "Type 1 cümlesinde If yan cümlesi Present Simple ('is') alır."
                    }
                ]
            })
        },

        # === B2 LEVEL ===
        {
            "level": "B2",
            "module_type": "grammar",
            "title": "Conditionals (Type 2 & 3) & Mixed Conditionals",
            "subtitle": "Varsayımsal durumlar ve pişmanlıklar",
            "description": "Geçmişteki pişmanlıkları ve gerçekleşmemiş senaryoları akıcı ifade etme.",
            "estimated_minutes": 22,
            "order_index": 1,
            "content_json": json.dumps({
                "explanation": "Type 2 şimdiki zamandaki hayali durumları (If I were you, I would study), Type 3 ise geçmişte gerçekleşmemiş olayları (If I had known, I would have helped) anlatır.",
                "rules": [
                    {"rule": "Type 2: If + Past Simple, would + V1", "example": "If I won the lottery, I would travel around the world."},
                    {"rule": "Type 3: If + Past Perfect, would have + V3", "example": "If you had informed us, we would have waited for you."}
                ],
                "practice_quiz": [
                    {
                        "question": "If they ___ the deadline, the contract wouldn't have been canceled.",
                        "options": ["met", "had met", "meet", "would meet"],
                        "answer": "had met",
                        "explanation": "Sonuç cümlesinde 'wouldn't have been' olduğundan Type 3 gereği 'had met' kullanılır."
                    }
                ]
            })
        },
        {
            "level": "B2",
            "module_type": "reading",
            "title": "Artificial Intelligence in Modern Medicine",
            "subtitle": "Yapay zekanın teşhis ve tedavi süreçlerindeki rolü",
            "description": "Akademik terimlerle zenginleştirilmiş B2 seviye analitik makale.",
            "estimated_minutes": 18,
            "order_index": 2,
            "content_json": json.dumps({
                "passage": "In recent years, deep learning algorithms have demonstrated diagnostic accuracy comparable to senior radiologists in identifying pulmonary abnormalities. By analyzing thousands of high-resolution CT scans within seconds, these systems alleviate clinician burnout and minimize oversight errors. Nonetheless, bioethicists urge caution regarding algorithmic bias and the transparency of decision-making protocols. The consensus remains that AI should augment, rather than entirely replace, human judgment in clinical settings.",
                "vocabulary_hints": [
                    {"word": "diagnostic accuracy", "tr": "teşhis doğruluğu"},
                    {"word": "alleviate", "tr": "hafifletmek, yatıştırmak"},
                    {"word": "algorithmic bias", "tr": "algoritmik önyargı"},
                    {"word": "augment", "tr": "desteklemek, artırmak"}
                ],
                "questions": [
                    {
                        "question": "According to the passage, what is a key benefit of AI in radiology?",
                        "options": ["It replaces all doctors permanently", "It reduces oversight errors and clinician burnout", "It eliminates the need for CT scans", "It cures all lung diseases instantly"],
                        "answer": "It reduces oversight errors and clinician burnout",
                        "explanation": "'alleviate clinician burnout and minimize oversight errors' açıkça belirtilmiştir."
                    }
                ]
            })
        },
        {
            "level": "B2",
            "module_type": "test",
            "title": "B2 Akademik Dil Yeterlilik Testi",
            "subtitle": "Devrik cümleler, pasif yapılar ve gelişmiş bağlaçlar",
            "description": "YDS ve uluslararası sınavlara hazırlık niteliğinde B2 testi.",
            "estimated_minutes": 15,
            "order_index": 3,
            "content_json": json.dumps({
                "questions": [
                    {
                        "id": 1,
                        "question": "Rarely ___ such extraordinary resilience in the face of economic hardship.",
                        "options": ["we have seen", "have we seen", "did we saw", "we saw"],
                        "answer": "have we seen",
                        "explanation": "Olumsuz veya kısıtlayıcı zarflar (Rarely, Seldom) cümle başına geldiğinde devriklik (inversion) oluşur."
                    }
                ]
            })
        },
        {
            "level": "B2",
            "module_type": "game",
            "title": "Akademik Kelime Avı",
            "subtitle": "Eş anlamlıları bulup eşleştirin",
            "description": "B2-C1 seviye akademik eş anlamlıları eşleştirin.",
            "estimated_minutes": 10,
            "order_index": 4,
            "content_json": json.dumps({
                "game_mode": "matching",
                "pairs": [
                    {"en": "Alleviate", "tr": "Relieve (Hafifletmek)"},
                    {"en": "Scrutinize", "tr": "Examine closely (İncelemek)"},
                    {"en": "Plausible", "tr": "Reasonable (Makul)"},
                    {"en": "Deteriorate", "tr": "Worsen (Kötüleşmek)"}
                ]
            })
        },
        {
            "level": "B2",
            "module_type": "grammar",
            "title": "Relative Clauses: Defining & Non-Defining",
            "subtitle": "Who, which, that, whose, where ve virgül kuralları",
            "description": "İki cümleyi bağlayarak akıcı, karmaşık ve edebi cümleler oluşturma becerisi.",
            "estimated_minutes": 22,
            "order_index": 5,
            "content_json": json.dumps({
                "explanation": "Defining relative clause cümleden çıkarıldığında anlam bozulur ve virgül kullanılmaz ('that' kullanılabilir). Non-defining relative clause ise zaten bilinen bir nesneye/kişiye ek bilgi verir, virgüller arasına alınır ve 'that' KULLANILMAZ.",
                "rules": [
                    {"rule": "Defining: The scientist who discovered the vaccine won the award.", "example": "The laptop that I bought yesterday broke down."},
                    {"rule": "Non-defining: Albert Einstein, who was born in Germany, revolutionized physics.", "example": "My car, which is ten years old, still runs well."},
                    {"rule": "Sahiplik: whose (The man whose car was stolen...)", "example": "She is the author whose books sold millions."}
                ],
                "dialogue": [
                    {"speaker": "Editor", "text": "Who is the candidate whose proposal was selected?"},
                    {"speaker": "Assistant", "text": "It is Dr. Taylor, who has published several papers on renewable energy."},
                    {"speaker": "Editor", "text": "Is this the project that received the university grant?"},
                    {"speaker": "Assistant", "text": "Exactly, the grant which was approved last month."}
                ],
                "practice_quiz": [
                    {
                        "question": "The professor, ___ lectures are attended by hundreds of students, is retiring.",
                        "options": ["whose", "who", "which", "that"],
                        "answer": "whose",
                        "explanation": "Kendisinin dersleri (lectures) kastedildiği için iyelik bağlacı 'whose' kullanılır."
                    },
                    {
                        "question": "Paris, ___ is known as the City of Light, attracts millions of tourists every year.",
                        "options": ["which", "that", "where", "what"],
                        "answer": "which",
                        "explanation": "Non-defining (virgüllü) cümlede nesne/şehir ismi için 'that' kullanılamaz, 'which' doğru seçenektir."
                    }
                ]
            })
        },
        {
            "level": "B2",
            "module_type": "grammar",
            "title": "Third Conditional & Mixed Conditionals",
            "subtitle": "Geçmişe dair pişmanlıklar ve geçmişin bugüne yansıması",
            "description": "If + had V3, would have V3 kalıbı ve geçmişteki durumun şu anki sonuca etkisi.",
            "estimated_minutes": 22,
            "order_index": 6,
            "content_json": json.dumps({
                "explanation": "Third Conditional (If + had + V3, would have + V3) geçmişte gerçekleşmemiş olayların hayali geçmiş sonucunu anlatır (pişmanlıklar). Mixed Conditionals ise geçmişteki bir eylemin ŞİMDİKİ duruma etkisini anlatır (If + had + V3, would + V1).",
                "rules": [
                    {"rule": "Third Conditional: If I had studied harder, I would have passed the exam.", "example": "If she had left earlier, she wouldn't have missed her flight."},
                    {"rule": "Mixed Conditional (Past -> Present): If I had taken that job, I would be living in New York now.", "example": "If he hadn't won the lottery, he wouldn't be so wealthy today."}
                ],
                "dialogue": [
                    {"speaker": "Tolga", "text": "If you had known about the traffic jam, would you have taken the train?"},
                    {"speaker": "Deniz", "text": "Definitely! If I had taken the train, I wouldn't have been late for the interview."},
                    {"speaker": "Tolga", "text": "And if you had gotten the job, you would be working in London right now!"}
                ],
                "practice_quiz": [
                    {
                        "question": "If they ___ the alarm, the fire wouldn't have spread so rapidly.",
                        "options": ["had heard", "heard", "hear", "would hear"],
                        "answer": "had heard",
                        "explanation": "Geçmişteki gerçekleşmemiş koşul için Third Conditional: 'had heard' kullanılır."
                    },
                    {
                        "question": "If I had accepted the scholarship last year, I ___ at Oxford today.",
                        "options": ["would be studying", "would have studied", "will study", "studied"],
                        "answer": "would be studying",
                        "explanation": "Geçmişteki kararın bugünkü sonucunu (today) anlatan Mixed Conditional yapısı 'would be studying' gerektirir."
                    }
                ]
            })
        },

        # === C1 LEVEL ===
        {
            "level": "C1",
            "module_type": "grammar",
            "title": "Advanced Inversion & Subjunctive Mood",
            "subtitle": "Resmi üslup, devrik yapılar ve dilek kipi",
            "description": "Akademik makalelerde ve diplomatik dilde kullanılan ileri gramer incelikleri.",
            "estimated_minutes": 25,
            "order_index": 1,
            "content_json": json.dumps({
                "explanation": "C1 seviyesinde üslubu zenginleştirmek için 'Under no circumstances', 'Not only... but also', 'Had it not been for' gibi devrik yapılar ve subjunctive yapılar (It is imperative that he be present) kullanılır.",
                "rules": [
                    {"rule": "Negative Inversion: Under no circumstances should you disclose this data.", "example": "Not until midnight did the negotiations conclude."},
                    {"rule": "Subjunctive: We demand that the committee revise the proposal.", "example": "It is essential that every delegate submit their feedback."}
                ],
                "practice_quiz": [
                    {
                        "question": "Had it not been for her swift intervention, the deal ___ collapsed.",
                        "options": ["would have", "will have", "had been", "is having"],
                        "answer": "would have",
                        "explanation": "'Had it not been for' yapısı 'If it had not been for' anlamında devrik 3. koşuldur."
                    }
                ]
            })
        },
        {
            "level": "C1",
            "module_type": "reading",
            "title": "Geopolitical Shifts and Sustainable Energy",
            "subtitle": "Küresel enerji güvenliği ve yeşil dönüşüm analizi",
            "description": "C1 düzeyinde karmaşık argümanları çözümleme ve çıkarım yapma pratiği.",
            "estimated_minutes": 20,
            "order_index": 2,
            "content_json": json.dumps({
                "passage": "The ongoing transition from fossil fuel dependency toward decentralized renewable grids constitutes both an environmental imperative and an unprecedented geopolitical recalibration. Nations historically endowed with petroleum reserves find themselves compelled to diversify sovereign wealth portfolios, while states pioneering photovoltaic manufacturing and rare-earth mineral extraction gain burgeoning leverage. Nevertheless, infrastructural inertia and supply-chain vulnerabilities persist as formidable bottlenecks.",
                "vocabulary_hints": [
                    {"word": "recalibration", "tr": "yeniden kalibre etme / dengelenme"},
                    {"word": "endowed with", "tr": "... ile donatılmış, zengin"},
                    {"word": "burgeoning leverage", "tr": "hızla büyüyen güç / koz"},
                    {"word": "infrastructural inertia", "tr": "altyapısal eylemsizlik / hantallık"}
                ],
                "questions": [
                    {
                        "question": "What is described as a major obstacle to the green transition?",
                        "options": ["Lack of solar radiation", "Infrastructural inertia and supply-chain bottlenecks", "Total consensus among oil producers", "Absence of renewable technologies"],
                        "answer": "Infrastructural inertia and supply-chain bottlenecks",
                        "explanation": "Metnin son cümlesi altyapı hantallığı ve tedarik zinciri hassasiyetlerini engel olarak gösterir."
                    }
                ]
            })
        },
        {
            "level": "C1",
            "module_type": "test",
            "title": "C1 Ustalaşma ve İleri Dil Testi",
            "subtitle": "Nüanslar, deyimsel kullanımlar ve akademik mantık",
            "description": "En üst düzey İngilizce mantık ve dilbilgisi testi.",
            "estimated_minutes": 20,
            "order_index": 3,
            "content_json": json.dumps({
                "questions": [
                    {
                        "id": 1,
                        "question": "The ambassador's remarks were so ambiguous that they were open to multiple ___.",
                        "options": ["interpretations", "distortions", "allegations", "stipulations"],
                        "answer": "interpretations",
                        "explanation": "Muğlak (ambiguous) sözler birden fazla yoruma (interpretations) açıktır."
                    }
                ]
            })
        },
        {
            "level": "C1",
            "module_type": "game",
            "title": "C1 Hızlı Mantık ve Eşleşme",
            "subtitle": "İleri düzey akademik collocation eşleştirmesi",
            "description": "Kalıp ifadeleri doğru tamamlayarak puanları toplayın.",
            "estimated_minutes": 10,
            "order_index": 4,
            "content_json": json.dumps({
                "game_mode": "matching",
                "pairs": [
                    {"en": "Cast doubt on", "tr": "Şüphe düşürmek"},
                    {"en": "Bear fruit", "tr": "Sonuç / meyve vermek"},
                    {"en": "At the expense of", "tr": "Pahasına"},
                    {"en": "Draw a conclusion", "tr": "Çıkarım yapmak"}
                ]
            })
        },
        {
            "level": "C1",
            "module_type": "grammar",
            "title": "Participle Clauses & Gerund/Infinitive Nüansları",
            "subtitle": "Zaman ve neden bildiren yan cümleleri zarf-fiillerle sadeleştirme",
            "description": "Akademik makalelerde ve C1/YDS sınavlarında sıkça rastlanan Present/Past Participle yapıları.",
            "estimated_minutes": 24,
            "order_index": 5,
            "content_json": json.dumps({
                "explanation": "Özneleri aynı olan iki cümleyi bağlarken etkin fiiller için 'V-ing' (Present Participle), edilgen fiiller için 'V3 / Having been V3' (Past Participle) kullanılır. Örneğin: 'Because he was exhausted, he fell asleep' -> 'Being exhausted, he fell asleep'. Ayrıca 'remember/stop/regret + gerund vs infinitive' anlam farkları incelenir.",
                "rules": [
                    {"rule": "Aktif zaman/neden kısaltması: Having finished the experiment, the scientist published the data.", "example": "Walking down the street, she ran into an old colleague."},
                    {"rule": "Pasif kısaltma: Written in 1920, the novel still resonates with readers today.", "example": "Surrounded by mountains, the village experiences severe winters."},
                    {"rule": "Remember to do (yapmayı unutma) vs Remember doing (geçmişte yaptığını hatırlama)", "example": "I remember meeting him in Paris."}
                ],
                "dialogue": [
                    {"speaker": "Reviewer", "text": "Having examined the clinical trial results, what conclusion did the committee reach?"},
                    {"speaker": "Lead Scientist", "text": "Being fully aware of the potential side effects, they decided to approve phase three."}
                ],
                "practice_quiz": [
                    {
                        "question": "___ all day in the hot sun, the construction workers were utterly exhausted.",
                        "options": ["Having worked", "Worked", "To work", "Being worked"],
                        "answer": "Having worked",
                        "explanation": "Önceden tamamlanmış ve nedensellik bildiren aktif eylem için 'Having + V3' (Having worked) kullanılır."
                    },
                    {
                        "question": "Never forget ___ the front door before going to sleep.",
                        "options": ["to lock", "locking", "locked", "having locked"],
                        "answer": "to lock",
                        "explanation": "'Forget to do' yapılması gereken bir görevi unutmamak anlamında kullanılır."
                    }
                ]
            })
        },

        # === C2 LEVEL ===
        {
            "level": "C2",
            "module_type": "grammar",
            "title": "Mastery Level Stylistics & Discourse Markers",
            "subtitle": "Ana dili seviyesinde retorik, edebi anlatım ve ton uyumu",
            "description": "C2 seviyesi kusursuz akıcılık, ima sanatları ve dilin felsefesi.",
            "estimated_minutes": 30,
            "order_index": 1,
            "content_json": json.dumps({
                "explanation": "C2 düzeyinde dil bilgisi sadece kurallarla değil, ton, ima, retorik figürler ve stilistik inceliklerle ölçülür.",
                "rules": [
                    {"rule": "Cleft Sentences: It was not until... that...", "example": "What strikes me most is his unflinching candor."},
                    {"rule": "Ellipsis & Substitution: Using brevity for sophisticated rhetoric.", "example": "Some preferred caution; others, audacity."}
                ],
                "practice_quiz": [
                    {
                        "question": "What strikes me most about his speech ___ his uncompromising sincerity.",
                        "options": ["is", "are", "being", "to be"],
                        "answer": "is",
                        "explanation": "'What strikes me most' tekil bir isim cümlesidir, bu yüzden 'is' alır."
                    }
                ]
            })
        },
        {
            "level": "C2",
            "module_type": "reading",
            "title": "The Epistemology of Linguistic Relativity",
            "subtitle": "Dil, düşünce kalıpları ve algı felsefesi",
            "description": "Sapir-Whorf hipotezi ve modern bilişsel bilim ekseninde derinlikli bir metin.",
            "estimated_minutes": 25,
            "order_index": 2,
            "content_json": json.dumps({
                "passage": "Linguistic relativity, frequently epitomized by the Sapir-Whorf hypothesis, posits that the idiosyncratic architecture of a natural language exerts a palpable, if not deterministic, influence upon its speakers' cognition. While radical linguistic determinism has been largely debunked by contemporary neuroscientists, empirical nuances suggest that syntactic categorizations subtly shape spatial orientation, temporal perception, and chromatic discrimination across cultural enclaves.",
                "vocabulary_hints": [
                    {"word": "idiosyncratic", "tr": "kendine has, özgün"},
                    {"word": "palpable", "tr": "hissedilir, somut"},
                    {"word": "debunked", "tr": "çürütülmüş, asılsızlığı kanıtlanmış"},
                    {"word": "chromatic discrimination", "tr": "renk ayrımlama hassasiyeti"}
                ],
                "questions": [
                    {
                        "question": "What is the stance of contemporary cognitive science regarding extreme linguistic determinism?",
                        "options": ["It has been universally accepted without skepticism", "It has been largely refuted/debunked", "It has replaced evolutionary biology", "It applies only to mathematics"],
                        "answer": "It has been largely refuted/debunked",
                        "explanation": "'radical linguistic determinism has been largely debunked by contemporary neuroscientists' ifadesi cevaptır."
                    }
                ]
            })
        },
        {
            "level": "C2",
            "module_type": "test",
            "title": "C2 Ustalık Sınavı",
            "subtitle": "En üst düzey retorik ve vokabüler testi",
            "description": "Profesyonel çevirmenler ve dilbilimciler için hazırlanmış C2 testi.",
            "estimated_minutes": 25,
            "order_index": 3,
            "content_json": json.dumps({
                "questions": [
                    {
                        "id": 1,
                        "question": "His persistent refusal to compromise proved to be his ultimate ___.",
                        "options": ["undoing", "vindication", "serendipity", "penchant"],
                        "answer": "undoing",
                        "explanation": "'Undoing' felakete / çöküşe yol açan sebep demektir."
                    }
                ]
            })
        },
        {
            "level": "C2",
            "module_type": "game",
            "title": "C2 Deyim & İroni Şifre Çözücü",
            "subtitle": "Deyimsel nüansları ve edebi terimleri eşleştirin",
            "description": "Gelişmiş deyimleri anlamlarıyla doğru bağdaştırın.",
            "estimated_minutes": 10,
            "order_index": 4,
            "content_json": json.dumps({
                "game_mode": "matching",
                "pairs": [
                    {"en": "A double-edged sword", "tr": "İki ucu keskin bıçak (avantaj ve risk barındıran)"},
                    {"en": "Play devil's advocate", "tr": "Şeytanın avukatlığını yapmak (karşıt fikri savunmak)"},
                    {"en": "Read between the lines", "tr": "Satır aralarını okumak"},
                    {"en": "Bite the bullet", "tr": "Acı reçeteyi kabullenmek / dişi sıkmak"}
                ]
            })
        },
        {
            "level": "C2",
            "module_type": "grammar",
            "title": "Üst Düzey Retorik: Ellipsis, Substitution & Fronting",
            "subtitle": "Akademik metinlerde gereksiz tekrarları önleme ve vurgu sanatı",
            "description": "Sözcük eksiltme (ellipsis), yerine koyma (do so, one) ve cümle öğelerini başa alarak odak oluşturma (fronting).",
            "estimated_minutes": 25,
            "order_index": 5,
            "content_json": json.dumps({
                "explanation": "C2 seviyesinde dil ustalığı, kelime tekrarlarını zarif biçimde elemek (Ellipsis) ve belirli öğeleri cümlenin en başına taşıyarak (Fronting/Topicalization) retorik vurgu yaratmakla ölçülür. Örneğin: 'Never before have I seen...' veya 'Gone are the days when...' gibi yapılar.",
                "rules": [
                    {"rule": "Ellipsis (Eksiltme): She wanted to speak at the summit, but she was unable to [speak].", "example": "Some came by car, others [came] on foot."},
                    {"rule": "Substitution: If you need a reference book, I have several useful ones.", "example": "He promised to revise his manuscript, and did so immediately."},
                    {"rule": "Fronting (Öne alma): Up into the air went the rocket.", "example": "Fascinating though the theory was, empirical proof remained elusive."}
                ],
                "dialogue": [
                    {"speaker": "Professor", "text": "Do you believe the administration will approve the revised tenure criteria?"},
                    {"speaker": "Dean", "text": "I certainly hope so. Should they refuse to do so, several prominent faculty members will resign."}
                ],
                "practice_quiz": [
                    {
                        "question": "Intriguing ___ the hypothesis was, the committee demanded further replication data.",
                        "options": ["though", "despite", "although", "even"],
                        "answer": "though",
                        "explanation": "'Adjective + though + subject + verb' (Intriguing though the hypothesis was) C2 düzeyinde ileri bir zıtlık ve fronting yapısıdır."
                    },
                    {
                        "question": "Rarely ___ such profound consensus among theoretical physicists.",
                        "options": ["does one encounter", "one encounters", "one does encounter", "encounters one"],
                        "answer": "does one encounter",
                        "explanation": "Olumsuz zarf (Rarely) başa geldiğinde devrik yapı (Inversion: auxiliary + subject + verb) zorunludur."
                    }
                ]
            })
        }
    ]

    module_objs = []
    for m in modules:
        mod_obj = CurriculumModule(
            level=m["level"],
            module_type=m["module_type"],
            title=m["title"],
            subtitle=m["subtitle"],
            description=m["description"],
            estimated_minutes=m["estimated_minutes"],
            order_index=m["order_index"],
            content_json=m["content_json"]
        )
        db.add(mod_obj)
        module_objs.append(mod_obj)

    db.flush()

    # Assign completed progress for A1 and A2 to showcase tracking & curriculum progress
    for m_obj in module_objs:
        if m_obj.level in ["A1", "A2"]:
            prog = StudentProgress(
                student_id=student.id,
                module_id=m_obj.id,
                completed=True,
                score=92.0,
                attempts=1
            )
            db.add(prog)

    # 3. Flashcards with Spaced Repetition logic (Leitner boxes)
    flashcards_data = [
        # A1-A2
        {"level": "A1", "word": "Achieve", "phonetic": "/əˈtʃiːv/", "translation": "Başarmak, elde etmek", "part_of_speech": "verb", "example_en": "You can achieve your goals with regular practice.", "example_tr": "Düzenli pratikle hedeflerine ulaşabilirsin.", "category": "Günlük Eylemler"},
        {"level": "A1", "word": "Opportunity", "phonetic": "/ˌɒp.əˈtʃuː.nə.ti/", "translation": "Fırsat, olanak", "part_of_speech": "noun", "example_en": "This scholarship is a great opportunity for students.", "example_tr": "Bu burs öğrenciler için harika bir fırsat.", "category": "Eğitim & Kariyer"},
        {"level": "A1", "word": "Confident", "phonetic": "/ˈkɒn.fɪ.dənt/", "translation": "Kendinden emin, özgüvenli", "part_of_speech": "adj", "example_en": "She felt confident during her English presentation.", "example_tr": "İngilizce sunumu sırasında kendinden emin hissetti.", "category": "Kişisel Özellikler"},
        {"level": "A2", "word": "Improve", "phonetic": "/ɪmˈpruːv/", "translation": "Geliştirmek, ilerletmek", "part_of_speech": "verb", "example_en": "Reading daily helps you improve your vocabulary.", "example_tr": "Günlük okumak kelime dağarcığını geliştirmene yardımcı olur.", "category": "Öğrenme"},
        {"level": "A2", "word": "Challenge", "phonetic": "/ˈtʃæl.ɪndʒ/", "translation": "Zorluk, meydan okuma", "part_of_speech": "noun", "example_en": "Learning a new language is an exciting challenge.", "example_tr": "Yeni bir dil öğrenmek heyecan verici bir meydan okumadır.", "category": "Gelişim"},
        {"level": "A2", "word": "Describe", "phonetic": "/dɪˈskraɪb/", "translation": "Tanımlamak, betimlemek", "part_of_speech": "verb", "example_en": "Can you describe your hometown?", "example_tr": "Memleketini tarif edebilir misin?", "category": "İletişim"},
        # B1-B2
        {"level": "B1", "word": "Crucial", "phonetic": "/ˈkruː.ʃəl/", "translation": "Hayati önemde, çok önemli", "part_of_speech": "adj", "example_en": "Consistency is crucial when preparing for exams.", "example_tr": "Sınavlara hazırlanırken istikrar hayati önem taşır.", "category": "Akademik Sıfatlar"},
        {"level": "B1", "word": "Determine", "phonetic": "/dɪˈtɜː.mɪn/", "translation": "Belirlemek, saptamak", "part_of_speech": "verb", "example_en": "Your attitude determines your direction.", "example_tr": "Tutumun senin yönünü belirler.", "category": "Eylemler"},
        {"level": "B1", "word": "Reluctant", "phonetic": "/rɪˈlʌk.tənt/", "translation": "İsteksiz, gönülsüz", "part_of_speech": "adj", "example_en": "He was reluctant to speak English at first, but now loves it.", "example_tr": "İlk başta İngilizce konuşmaya isteksizdi ama şimdi çok seviyor.", "category": "Duygular"},
        {"level": "B2", "word": "Ambiguous", "phonetic": "/æmˈbɪɡ.ju.əs/", "translation": "Belirsiz, iki anlamlı", "part_of_speech": "adj", "example_en": "The instructions were ambiguous, so students asked for clarification.", "example_tr": "Yönergeler belirsizdi, bu yüzden öğrenciler açıklama istedi.", "category": "İleri Düzey Kelimeler"},
        {"level": "B2", "word": "Substantial", "phonetic": "/səbˈstæn.ʃəl/", "translation": "Önemli derecede, büyük ölçüde", "part_of_speech": "adj", "example_en": "There has been a substantial rise in online language learners.", "example_tr": "Çevrimiçi dil öğrenenlerde önemli bir artış yaşandı.", "category": "İstatistik & Değişim"},
        {"level": "B2", "word": "Facilitate", "phonetic": "/fəˈsɪl.ɪ.teɪt/", "translation": "Kolaylaştırmak, olanak sağlamak", "part_of_speech": "verb", "example_en": "Interactive exercises facilitate active memorization.", "example_tr": "Etkileşimli alıştırmalar aktif ezberlemeyi kolaylaştırır.", "category": "Akademik Fiiller"},
        # C1-C2
        {"level": "C1", "word": "Exacerbate", "phonetic": "/ɪɡˈzæs.ə.beɪt/", "translation": "Kötüleştirmek, alevlendirmek", "part_of_speech": "verb", "example_en": "Lack of sleep will exacerbate stress levels.", "example_tr": "Uykusuzluk stres seviyelerini daha da kötüleştirecektir.", "category": "YDS / C1 Kelimeleri"},
        {"level": "C1", "word": "Ubiquitous", "phonetic": "/juːˈbɪk.wɪ.təs/", "translation": "Her yerde bulunan, yaygın", "part_of_speech": "adj", "example_en": "Smartphones have become ubiquitous in modern society.", "example_tr": "Akıllı telefonlar modern toplumda her yerde bulunur hale geldi.", "category": "YDS / C1 Kelimeleri"},
        {"level": "C2", "word": "Ephemeral", "phonetic": "/ɪˈfem.ər.əl/", "translation": "Geçici, fani, kısa ömürlü", "part_of_speech": "adj", "example_en": "Fame in social media is often ephemeral.", "example_tr": "Sosyal medyadaki şöhret çoğu zaman geçicidir.", "category": "Edebi & Felsefi"},
        {"level": "C2", "word": "Quintessential", "phonetic": "/ˌkwɪn.tɪˈsen.ʃəl/", "translation": "Mükemmel örneği olan, özünü yansıtan", "part_of_speech": "adj", "example_en": "Fish and chips is the quintessential British meal.", "example_tr": "Balık ve patates kızartması mükemmel bir geleneksel İngiliz yemeğidir.", "category": "Edebi & Felsefi"}
    ]

    flashcard_objs = []
    for fc in flashcards_data:
        f_obj = Flashcard(**fc)
        db.add(f_obj)
        flashcard_objs.append(f_obj)
    
    db.flush()

    # Assign some student progress on flashcards to demonstrate the Spaced Repetition (SRS)
    boxes = [4, 3, 2, 1, 2, 3, 1, 4]
    for idx, f_obj in enumerate(flashcard_objs[:8]):
        progress = StudentFlashcardProgress(
            student_id=student.id,
            flashcard_id=f_obj.id,
            box=boxes[idx % len(boxes)],
            consecutive_correct=boxes[idx % len(boxes)],
            review_count=boxes[idx % len(boxes)] + 1
        )
        db.add(progress)

    # 4. National Exams: YDS and LGS
    # Exam 1: YDS Full-length / Practice Test
    yds_exam = Exam(
        exam_type="YDS",
        title="2024 YDS Bahar Dönemi Özgün Deneme Sınavı",
        description="ÖSYM soru formatına ve zorluk derecesine %100 uyumlu, gramer, kelime bilgisi, cümle tamamlama ve paragraf soruları.",
        duration_minutes=180,
        difficulty="İleri",
        total_questions=10
    )
    db.add(yds_exam)
    db.flush()

    yds_questions = [
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Kelime Bilgisi (Vocabulary)",
            "question_text": "Recent archaeological findings in Mesopotamia have provided ___ evidence confirming trade interactions between ancient Indus and Sumerian civilizations.",
            "option_a": "ambiguous",
            "option_b": "compelling",
            "option_c": "hazardous",
            "option_d": "trivial",
            "option_e": "redundant",
            "correct_option": "B",
            "explanation": "'Compelling evidence' (ikna edici, güçlü kanıt) yaygın bir akademik collocation yapısıdır. Diğer şıklar: ambiguous (muğlak), hazardous (tehlikeli), trivial (önemsiz), redundant (gereksiz)."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Gramer & Edat (Prepositions)",
            "question_text": "The government was criticized ___ failing to allocate sufficient subsidies ___ renewable energy projects during the transition period.",
            "option_a": "for / to",
            "option_b": "with / for",
            "option_c": "in / with",
            "option_d": "by / about",
            "option_e": "about / in",
            "correct_option": "A",
            "explanation": "'Criticize someone for something' (birini bir şey yüzünden eleştirmek) ve 'allocate something to something' (bir şeyi bir yere tahsis etmek) doğru edat kalıplarıdır."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Cümle Tamamlama",
            "question_text": "Although artificial intelligence dramatically enhances diagnostic speed in healthcare, ___.",
            "option_a": "it has been completely abandoned by major hospitals worldwide",
            "option_b": "physicians still need to oversee critical clinical determinations to ensure safety",
            "option_c": "there is no need for any human involvement whatsoever",
            "option_d": "software engineers have decided to halt all research indefinitely",
            "option_e": "patients inevitably experience longer recovery times in every case",
            "correct_option": "B",
            "explanation": "'Although' zıtlık bağlacıdır. İlk cümledeki olumlu 'dramatically enhances' ifadesine zıt olarak, güvenliği temin etmek için hekimlerin hala gözetim yapması gerektiği (B şıkkı) mantıksal zıtlığı tamamlar."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Paragraf Anlam Bütünlüğü",
            "passage": "Oceans absorb roughly thirty percent of anthropogenic carbon dioxide emissions, cushioning the biosphere against catastrophic thermal swings. However, sustained saturation induces marine acidification, which impairs calcification among mollusks and coral reefs. If sustained at current metrics, marine trophic pyramids face unprecedented collapse by mid-century.",
            "question_text": "It can be inferred from the passage that ocean carbon absorption ___.",
            "option_a": "is exclusively beneficial with no adverse consequences for marine life",
            "option_b": "acts as a climatic buffer at the expense of increasing ocean acidification",
            "option_c": "has completely halted due to the extinction of coral ecosystems",
            "option_d": "is primarily driven by synthetic chemicals introduced by humans",
            "option_e": "will permanently solve global warming without reducing industrial emissions",
            "correct_option": "B",
            "explanation": "Metinde okyanusların karbon emisyonunu emerek iklimi koruduğu (buffer), ancak bunun okyanus asitlenmesine yol açtığı 'at the expense of' ilişkisiyle açıklanmaktadır."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Diyalog Tamamlama",
            "question_text": "Semih: 'I noticed our university has integrated an automated speech evaluator for the language proficiency exams.'\nHande: 'Really? Aren't people worried about whether software can judge intonation accurately?'\nSemih: '___'\nHande: 'That sounds reassuring; human oversight is certainly essential.'",
            "option_a": "They simply decided to ignore intonation and focus only on spelling.",
            "option_b": "Actually, all human evaluators have been dismissed immediately.",
            "option_c": "The algorithm only flags borderline cases for double review by experienced human professors.",
            "option_d": "Nobody cares about pronunciation anymore in international exams.",
            "option_e": "I think the entire system will be canceled by next month.",
            "correct_option": "C",
            "explanation": "Hande'nin 'That sounds reassuring; human oversight is certainly essential' yanıtı, Semih'in şüpheli durumların insan hocalar tarafından incelendiğini (C şıkkı) söylediğini kanıtlar."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Phrasal Verbs (Deyimsel Fiiller)",
            "question_text": "Due to the unexpected economic recession, the board of directors decided to ___ the international launching of their new software until the second quarter.",
            "option_a": "put off",
            "option_b": "bring about",
            "option_c": "look down on",
            "option_d": "make up for",
            "option_e": "run out of",
            "correct_option": "A",
            "explanation": "'Put off' ertelemek/ötelemek anlamına gelir. Şirketin yazılım lansmanını ikinci çeyreğe kadar ertelemesi cümleyi anlamsal olarak kusursuz tamamlar. (bring about: sebep olmak, look down on: küçümsemek, make up for: telafi etmek, run out of: bitmek/tükenmek)"
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Gramer & Zaman Uyumları (Tenses & Modals)",
            "question_text": "By the time the scientific expedition ___ at the Arctic research station next month, the resident glaciologists ___ ice-core samples continuously for five decades.",
            "option_a": "arrived / have been collecting",
            "option_b": "arrives / will have been collecting",
            "option_c": "will arrive / had collected",
            "option_d": "is arriving / collected",
            "option_e": "has arrived / will collect",
            "correct_option": "B",
            "explanation": "'By the time + Simple Present (arrives), Future Perfect Continuous (will have been collecting)' zaman kalıbı, gelecekteki belirli bir ana kadar eylemin ne kadar süredir devam ediyor olacağını ifade etmek için kullanılır."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Cümle Tamamlama & Bağlaçlar",
            "question_text": "___ that the ancient Maya civilization suffered severe prolonged droughts, archaeological evidence indicates political instability was also a major catalyst for urban collapse.",
            "option_a": "While it is widely accepted",
            "option_b": "Despite the fact because",
            "option_c": "In case we conclude",
            "option_d": "As long as historians ignore",
            "option_e": "Now that it has been disproved",
            "correct_option": "A",
            "explanation": "'While it is widely accepted that...' (Maya uygarlığının şiddetli kuraklık çektiği yaygın olarak kabul edilmekle birlikte, ... aynı zamanda siyasi istikrarsızlığın da çöküşte katalizör olduğunu gösteriyor) cümlesinde 'While' zıtlık ve kabul bağlacı olarak kusursuz oturur."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Paragraf Tamamlama (Paragraph Cohesion)",
            "passage": "Urban forestry plays an instrumental role in moderating microclimates within dense metropolitan zones. Strategically placed tree canopies intercept solar radiation and dramatically lower surface temperatures. ___. Consequently, municipal authorities in humid regions are increasingly mandating green roofs and vertical gardens on commercial buildings.",
            "question_text": "Which of the following sentences best completes the paragraph?",
            "option_a": "This phenomenon, known as evapotranspiration, also humidifies dry air and mitigates urban heat island effects",
            "option_b": "Nonetheless, many city residents express dissatisfaction regarding fallen leaves during autumn",
            "option_c": "Automobile exhaust emissions have reached historic peaks across suburban corridors",
            "option_d": "Most high-rise residential buildings have completely discontinued glass facades",
            "option_e": "Concrete pavements are significantly less costly to install than planting mature deciduous trees",
            "correct_option": "A",
            "explanation": "Boşluktan önceki ağaçların sıcaklığı düşürmesi cümlesi ile sonraki 'Consequently, municipal authorities are mandating green roofs' sonucu arasındaki bilimsel mekanizmayı A seçeneğindeki 'evapotranspirasyon ve kentsel ısı adası etkisini azaltma' açıklaması tamamlar."
        },
        {
            "exam_id": yds_exam.id,
            "exam_type": "YDS",
            "category": "Çeviri (İngilizce - Türkçe Translation)",
            "question_text": "Cognitive psychologists argue that practicing a foreign language on a daily basis not only reinforces memory retention, but also stimulates neural pathways responsible for complex problem-solving.\nCümlenin en doğru Türkçe karşılığı hangisidir?",
            "option_a": "Bilişsel psikologlar, her gün yabancı dil pratiği yapmanın sadece hafızada tutmayı güçlendirmekle kalmayıp, karmaşık problem çözmeden sorumlu sinirsel yolakları da uyardığını savunmaktadır.",
            "option_b": "Yabancı dil öğrenen bireylerin hafızasının güçlenmesi ve problem çözme becerilerinin gelişmesi, bilişsel psikologların temel inceleme alanıdır.",
            "option_c": "Günde en az bir saat dil çalışmak, beynin sinirsel bağlantılarını hızlandırarak hafızada tutma oranını iki katına çıkarır.",
            "option_d": "Bilişsel psikologlara göre, karmaşık problemlerin çözülebilmesi için her gün düzenli yabancı dil tekrarı yapılması şarttır.",
            "option_e": "Sinirsel yolakların uyarılması ve hafızanın güçlendirilmesi, yalnızca yabancı dil pratiği yapan bireylerde gözlemlenmektedir.",
            "correct_option": "A",
            "explanation": "'Cognitive psychologists argue that...' -> 'Bilişsel psikologlar ... savunmaktadır.' '...not only reinforces memory retention, but also stimulates neural pathways responsible for complex problem-solving' -> '...sadece hafızada tutmayı güçlendirmekle kalmayıp, karmaşık problem çözmeden sorumlu sinirsel yolakları da uyardığını...'. Anlam ve yapı olarak tam karşılık A şıkkıdır."
        }
    ]

    for q in yds_questions:
        db.add(ExamQuestion(**q))

    # Exam 2: LGS Full-length Practice Test
    lgs_exam = Exam(
        exam_type="LGS",
        title="LGS İngilizce 1. Dönem Deneme Sınavı (Hedef 10/10)",
        description="MEB müfredatına tam uyumlu: Friendship, Teen Life, In the Kitchen ve On the Phone ünitelerinden yeni nesil beceri temelli sorular.",
        duration_minutes=40,
        difficulty="Orta",
        total_questions=5
    )
    db.add(lgs_exam)
    db.flush()

    lgs_questions = [
        {
            "exam_id": lgs_exam.id,
            "exam_type": "LGS",
            "category": "Friendship (Arkadaşlık)",
            "question_text": "Zeynep: 'Are you doing anything on Saturday afternoon? We are throwing a surprise birthday party for Ece.'\nBerk: 'I'd love to, but I have to help my father in the garden.'\nAccording to the conversation, what does Berk do?",
            "option_a": "He accepts the invitation and brings a gift.",
            "option_b": "He refuses the invitation with an excuse.",
            "option_c": "He invites Ece to his own garden party.",
            "option_d": "He organizes the party for Saturday.",
            "option_e": None,
            "correct_option": "B",
            "explanation": "Berk 'I'd love to, but...' diyerek daveti mazeret bildirerek (bahçede babasına yardım etmek zorunda) reddetmiştir (refuses with an excuse)."
        },
        {
            "exam_id": lgs_exam.id,
            "exam_type": "LGS",
            "category": "In the Kitchen (Mutfakta)",
            "passage": "Step 1: First, boil the pasta in salted water for 10 minutes.\nStep 2: Second, heat some olive oil in a pan and chop fresh tomatoes and garlic.\nStep 3: Next, cook the tomato sauce for 5 minutes.\nStep 4: Finally, drain the pasta and pour the delicious sauce over it.",
            "question_text": "Which step comes immediately after heating the olive oil and cooking the tomatoes?",
            "option_a": "Boiling the pasta in cold water",
            "option_b": "Draining the pasta and pouring the sauce",
            "option_c": "Buying olive oil from the supermarket",
            "option_d": "Washing the dirty dishes",
            "option_e": None,
            "correct_option": "B",
            "explanation": "Adım 3'ten sonra gelen son adım (Finally), makarnayı süzmek ve sosu üzerine dökmektir."
        },
        {
            "exam_id": lgs_exam.id,
            "exam_type": "LGS",
            "category": "Teen Life (Genç Yaşamı)",
            "question_text": "Kerem loves physical activities and spending time outdoors. He can't stand playing video games indoors or listening to loud heavy metal music.\nWhich of the following activities is SUITABLE for Kerem?",
            "option_a": "Attending a rock concert in an arena",
            "option_b": "Going trekking in the forest with friends",
            "option_c": "Playing online video games all weekend",
            "option_d": "Watching movies alone at home all day",
            "option_e": None,
            "correct_option": "B",
            "explanation": "Doğada vakit geçirmeyi ve fiziksel aktiviteleri seven Kerem için ormanda yürüyüş yapmak (trekking) en uygun etkinliktir."
        },
        {
            "exam_id": lgs_exam.id,
            "exam_type": "LGS",
            "category": "On the Phone (Telefonda)",
            "question_text": "Secretary: 'Hello, Derin Language School. How can I help you?'\nCaller: 'Hello, may I speak to Mr. Yılmaz, please?'\nSecretary: 'Hold on a moment, please. ___.'\nWhich sentence best completes the dialogue?",
            "option_a": "I'll put you through to his office",
            "option_b": "He never answers phone calls",
            "option_c": "You called the wrong phone number",
            "option_d": "Please don't call us again",
            "option_e": None,
            "correct_option": "A",
            "explanation": "Sekreterin 'Hold on a moment, please' (Lütfen hatta bekleyin) demesinden sonra 'I'll put you through' (Sizi ofisine bağlıyorum) kalıbı gelir."
        }
    ]

    for q in lgs_questions:
        db.add(ExamQuestion(**q))

    # Add a sample past exam result for student
    sample_result = StudentExamResult(
        student_id=student.id,
        exam_id=lgs_exam.id,
        exam_type="LGS",
        exam_title="LGS İngilizce 1. Dönem Deneme Sınavı (Hedef 10/10)",
        total_questions=4,
        correct_count=4,
        incorrect_count=0,
        empty_count=0,
        score=100.0,
        duration_taken_seconds=380,
        answers_json=json.dumps({"1": "B", "2": "B", "3": "B", "4": "A"})
    )
    db.add(sample_result)

    # 5. Schedule Items (My Schedule / Haftalık Takvim)
    schedule_data = [
        {
            "user_id": student.id,
            "title": "B1 Speaking Club: Seyahat ve Kültür",
            "day_name": "Pazartesi",
            "start_time": "19:00",
            "end_time": "20:00",
            "category": "speaking",
            "instructor_name": "Ayşe Kaya",
            "description": "Akıcı konuşma pratiği, farklı kültürler ve tatil anıları üzerine canlı sohbet.",
            "zoom_link": "https://meet.derintalks.com/speaking-b1"
        },
        {
            "user_id": student.id,
            "title": "YDS Paragraf ve Soru Çözüm Kampı",
            "day_name": "Çarşamba",
            "start_time": "20:30",
            "end_time": "22:00",
            "category": "exam",
            "instructor_name": "Murat Öz (Sınav Koordinatörü)",
            "description": "Çıkmış YDS sorularının analizleri, çeviri teknikleri ve zaman yönetimi stratejileri.",
            "zoom_link": "https://meet.derintalks.com/yds-camp"
        },
        {
            "user_id": student.id,
            "title": "Haftalık Kelime & Flashcard Değerlendirmesi",
            "day_name": "Cuma",
            "start_time": "18:00",
            "end_time": "18:45",
            "category": "tekrar",
            "instructor_name": "DerinTalks AI Mentor",
            "description": "Leitner kutusundaki 3. ve 4. seviye kelimelerin pekiştirilmesi.",
            "zoom_link": ""
        },
        {
            "user_id": student.id,
            "title": "Canlı Birebir Koçluk & Gelişim Takibi",
            "day_name": "Cumartesi",
            "start_time": "11:00",
            "end_time": "11:40",
            "category": "canli_ders",
            "instructor_name": "Ayşe Kaya",
            "description": "Öğrencinin haftalık hedeflerinin, quiz skorlarının ve eksiklerinin analizi.",
            "zoom_link": "https://meet.derintalks.com/ayse-koc"
        }
    ]

    for s in schedule_data:
        db.add(ScheduleItem(**s))

    # Commit all seed data
    db.commit()
    print("DerinTalks database successfully populated with mock & curriculum data!")
