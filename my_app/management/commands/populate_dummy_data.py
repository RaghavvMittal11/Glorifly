from django.core.management.base import BaseCommand
from my_app.models import (
    Subject, Chapter, Book, PYQ, Answer, Solution, Question,
    Student, Goals, MockTest, MockTestQuestion, SWOTanalysis, Ranking
)
from django.utils import timezone
from datetime import time
import random

class Command(BaseCommand):
    help = "Populate the database with dummy data"

    def handle(self, *args, **kwargs):
        # 1. Subjects
        math = Subject.objects.get_or_create(subject_name="Mathematics")[0]
        physics = Subject.objects.get_or_create(subject_name="Physics")[0]

        # 2. Chapters
        algebra = Chapter.objects.get_or_create(chapter_name="Algebra", subject=math)[0]
        mechanics = Chapter.objects.get_or_create(chapter_name="Mechanics", subject=physics)[0]

        # 3. Books
        book1 = Book.objects.get_or_create(book_name="Maths Vol I", author="R.D. Sharma", edition="2022")[0]
        book2 = Book.objects.get_or_create(book_name="Concepts of Physics", author="H.C. Verma", edition="2019")[0]

        # 4. PYQ
        pyq1 = PYQ.objects.get_or_create(exam_name=PYQ.JEE_MAINS, year_num=2022)[0]
        pyq2 = PYQ.objects.get_or_create(exam_name=PYQ.JEE_ADVANCED, year_num=2021)[0]

        # 5. Answer and Solution
        answer = Answer.objects.create(answer_text="Correct option is C.")
        solution = Solution.objects.create(solution_text="Step-by-step solution here.")

        # 6. Questions
        question1 = Question.objects.create(
            chapter=algebra,
            level_mode='Easy',
            type='MCQ',
            question_text="What is the value of x if x + 2 = 4?",
            book=book1,
            pyq=pyq1,
            subject=math,
            answer=answer,
            solution=solution
        )

        question2 = Question.objects.create(
            chapter=mechanics,
            level_mode='Hard',
            type='Numericals',
            question_text="Calculate acceleration for a mass of 2kg under 4N force.",
            book=book2,
            pyq=pyq2,
            subject=physics,
            answer=Answer.objects.create(answer_text="2 m/s²"),
            solution=Solution.objects.create(solution_text="Using Newton's Second Law..."),
        )

        # 7. Students
        student1 = Student.objects.create(
            student_name="Alice",
            student_email="alice@example.com",
            student_phone_number="1234567890"
        )
        student2 = Student.objects.create(
            student_name="Bob",
            student_email="bob@example.com",
            student_phone_number="0987654321"
        )

        # 8. Goals
        Goals.objects.create(student=student1, exam="JEE Mains", rank_aim=500)
        Goals.objects.create(student=student2, exam="JEE Advanced", rank_aim=100)

        # 9. MockTest
        test1 = MockTest.objects.create(
            student=student1,
            test_type='Standard',
            total_marks_obtained=15,
            nos_question=2,
            test_time=time(1, 0, 0),
            taken_at=timezone.now()
        )

        test2 = MockTest.objects.create(
            student=student2,
            test_type='Customised',
            total_marks_obtained=20,
            nos_question=2,
            test_time=time(1, 30, 0),
            taken_at=timezone.now()
        )

        # 10. MockTestQuestion
        MockTestQuestion.objects.create(test=test1, question=question1, marks_obtained=10)
        MockTestQuestion.objects.create(test=test1, question=question2, marks_obtained=5)

        MockTestQuestion.objects.create(test=test2, question=question1, marks_obtained=8)
        MockTestQuestion.objects.create(test=test2, question=question2, marks_obtained=12)

        # 11. SWOTanalysis
        SWOTanalysis.objects.create(student=student1, test=test1,
            strength="Strong in Algebra",
            weakness="Weak in Mechanics",
            opportunity="Revise more",
            threat="Time pressure"
        )

        SWOTanalysis.objects.create(student=student2, test=test2,
            strength="Good with numericals",
            weakness="Silly mistakes",
            opportunity="Use more mocks",
            threat="Overconfidence"
        )

        # 12. Ranking
        Ranking.objects.create(student=student1, test=test1, rank_position=2)
        Ranking.objects.create(student=student2, test=test2, rank_position=1)

        self.stdout.write(self.style.SUCCESS("✅ Dummy data populated successfully."))
