from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from django.contrib.auth.base_user import BaseUserManager

# -------------------------
# Subject Model
# -------------------------
class Subject(models.Model):
    subject_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.subject_name

# -------------------------
# Chapter Model
# -------------------------
class Chapter(models.Model):
    chapter_name = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return self.chapter_name

# -------------------------
# Book Model
# -------------------------
class Book(models.Model):
    book_name = models.CharField(max_length=255)
    author = models.CharField(max_length=255, null=True, blank=True)
    edition = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.book_name

# -------------------------
# PYQ Model (Previous Year Questions)
# -------------------------
class PYQ(models.Model):
    JEE_MAINS = 'JEE Mains'
    JEE_ADVANCED = 'JEE Advanced'
    EXAM_CHOICES = [
        (JEE_MAINS, 'JEE Mains'),
        (JEE_ADVANCED, 'JEE Advanced'),
    ]
    exam_name = models.CharField(max_length=20, choices=EXAM_CHOICES)
    year_num = models.IntegerField()

    def __str__(self):
        return f"{self.exam_name} - {self.year_num}"

# -------------------------
# Answer Model
# -------------------------
class Answer(models.Model):
    answer_text = models.TextField()

    def __str__(self):
        # Return first 50 characters as a summary
        return self.answer_text[:50]

# -------------------------
# Solution Model
# -------------------------

class Solution(models.Model):
    solution_text = models.TextField()

    def _str_(self):
        # Return first 50 characters as a summary
        return self.solution_text[:50]

# -------------------------
# Question Model
# -------------------------
class Question(models.Model):
    LEVEL_CHOICES = [
        ('JEE Mains', 'JEE Mains'),
        ('JEE Advanced', 'JEE Advanced'),
    ]
    TYPE_CHOICES = [
        ('MCQ', 'MCQ'),
        ('Multiple Choice MCQ', 'Multiple Choice MCQ'),
    ]
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    # You can adjust max_length values based on your requirements.
    level_mode = models.CharField(max_length=16, choices=LEVEL_CHOICES)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    question_text = models.TextField()
    # Optional foreign keys; allow NULL if the SQL was not enforcing NOT NULL.
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True, blank=True)
    pyq = models.ForeignKey(PYQ, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.PROTECT)
    solution = models.ForeignKey(Solution, on_delete=models.PROTECT)

    def __str__(self):
        return self.question_text[:50]

# -------------------------

# -------------------------
# Student Model
# -------------------------

class Student(models.Model):
    student_name = models.CharField(max_length=100)
    student_email = models.EmailField(unique=True)
    student_phone_number = models.CharField(max_length=15)

    student_password = models.CharField(max_length=100)  # Store hashed password
    

    def __str__(self):
        return self.student_name



# -------------------------
# Goals Model
# -------------------------
class Goals(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    exam = models.CharField(max_length=255)
    rank_aim = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.student_name} - {self.exam}"

# -------------------------
# MockTest Model
# -------------------------
class MockTest(models.Model):
    STANDARD = 'Standard'
    TEST_TYPE_CHOICES = [
        (STANDARD, 'Standard')
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    test_type = models.CharField(max_length=10, choices=TEST_TYPE_CHOICES)
    total_marks_obtained = models.IntegerField(null=True, blank=True)
    nos_question = models.IntegerField()
    test_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    taken_at = models.DateTimeField(null=True, blank=True)
    # Define a many-to-many field with a through model
    # questions = models.ManyToManyField(Question, through='MockTestQuestion')
    test = models.ForeignKey('Test', on_delete=models.CASCADE, null=False, blank=True)

    def __str__(self):
        return f"MockTest {self.pk} for {self.student.student_name}"

# -------------------------
# Test Model (for frontend use)
# -------------------------
class Test(models.Model):
    STANDARD = 'Standard'
    TEST_TYPE_CHOICES = [
        (STANDARD, 'Standard')
    ]
    test_type = models.CharField(max_length=10, choices=MockTest.TEST_TYPE_CHOICES)
    total_marks_obtained = models.IntegerField(null=True, blank=True)
    nos_question = models.IntegerField()
    test_time = models.TimeField()
    syallabus = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    taken_at = models.DateTimeField(null=True, blank=True)
    questions = models.ManyToManyField(Question, through='MockTestQuestion')

    def __str__(self):
        return f"Test {self.pk} - {self.test_type}"

# -------------------------
# MockTestQuestion Model (Through table)
# -------------------------
class MockTestQuestion(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    marks_obtained = models.IntegerField(default=0)

    class Meta:
        unique_together = ('test', 'question')

    def __str__(self):
        return f"Test {self.test.pk} - Question {self.question.pk}"


# -------------------------
# SWOTanalysis Model
# -------------------------
class SWOTanalysis(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE)
    strength = models.TextField(null=True, blank=True)
    weakness = models.TextField(null=True, blank=True)
    opportunity = models.TextField(null=True, blank=True)
    threat = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'test')

    def __str__(self):
        return f"SWOT for {self.student.student_name} on Test {self.test.pk}"

# -------------------------
# Ranking Model
# -------------------------
class Ranking(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE)
    rank_position = models.IntegerField()

    class Meta:
        unique_together = ('student', 'test')

    def __str__(self):
        return f"Ranking: {self.student.student_name} - Test {self.test.pk} - Rank {self.rank_position}"


