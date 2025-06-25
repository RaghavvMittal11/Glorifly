from rest_framework import serializers 
from .models import Subject, Student, Book, Question, Answer, PYQ, Solution, Chapter, Goals, MockTest, MockTestQuestion, SWOTanalysis, Ranking, Test
from django.db.models import Count, Avg
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Student
import re


User = get_user_model()

def extract_options_from_text(question_text):
    pattern = r'([A-D])\)\s*(.+?)(?=(?:\s+[A-D]\)|$))'
    matches = re.findall(pattern, question_text) 
    return [f"{label}) {text.strip()}" for label, text in matches]

# For Subject Model
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__' 

# For Question Model
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__' 


# For Book Model
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['book_name', 'author']  

# For Student Name
class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_name']  

# For PYQ Model
class QuestionPYQSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='pyq.exam_name')
    year_num = serializers.IntegerField(source='pyq.year_num')

    class Meta:
        model = Question
        fields = ['question_text', 'exam_name', 'year_num'] 

# For Answer Model
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text']  

# For Question with Answer
class QuestionDetailSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer()

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'answer']  

# For Subject with Question Count
class SubjectQuestionCountSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField()

    class Meta:
        model = Subject
        fields = ['id', 'subject_name', 'question_count']




# For Question Bank Page
class QuestionFrontendSerializer(serializers.ModelSerializer): 

    subject = serializers.CharField(source='subject.subject_name')
    level = serializers.SerializerMethodField() 
    type = serializers.SerializerMethodField() 
    content = serializers.SerializerMethodField() 
    options = serializers.SerializerMethodField() 
    class Meta:
            model = Question
            fields = ['id', 'subject', 'level', 'type', 'content', 'options']
    
    def get_level(self, obj):
        return obj.level_mode

    def get_type(self, obj):
        return obj.type
    
    def get_content(self, obj):
        # Assuming you have a method to get the question text
        lines = obj.question_text.strip().splitlines()
        question_lines = []
        for line in lines:
            if not re.match(r'^[A-D]\)', line.strip()):
                question_lines.append(line.strip())
            else:
                break  # options begin, stop accumulating question
        return " ".join(question_lines)

    def get_options(self, obj):
        # Extracting options from the question text using regex
        question_text = obj.question_text
        options = extract_options_from_text(question_text)
        return options
# For PYQ Page
class QuestionFrontendPYQSerializer(serializers.ModelSerializer): 

    subject = serializers.CharField(source='subject.subject_name')
    level = serializers.SerializerMethodField() 
    year_num = serializers.IntegerField(source='pyq.year_num')
    content = serializers.SerializerMethodField() 
    options = serializers.SerializerMethodField() 
    class Meta:
            model = Question
            fields = ['id', 'subject', 'level', 'year_num', 'content', 'options']
    
    def get_level(self, obj):
        return obj.level_mode

    def get_content(self, obj):
        # Assuming you have a method to get the question text
        lines = obj.question_text.strip().splitlines()
        question_lines = []
        for line in lines:
            if not re.match(r'^[A-D]\)', line.strip()):
                question_lines.append(line.strip())
            else:
                break  # options begin, stop accumulating question
        return " ".join(question_lines)

    def get_options(self, obj):
        # Extracting options from the question text using regex
        question_text = obj.question_text
        options = extract_options_from_text(question_text)
        return options
# For Book Page  
class QuestionFrontendBookSerializer(serializers.ModelSerializer): 

    subject = serializers.CharField(source='subject.subject_name')
    type = serializers.SerializerMethodField() 
    book_name = serializers.CharField(source='book.book_name')
    content = serializers.SerializerMethodField() 
    options = serializers.SerializerMethodField() 
    class Meta:
            model = Question
            fields = ['id', 'subject', 'type', 'book_name', 'content', 'options']
    
    def get_type(self, obj):
        return obj.type

    def get_content(self, obj):
        # Assuming you have a method to get the question text
        lines = obj.question_text.strip().splitlines()
        question_lines = []
        for line in lines:
            if not re.match(r'^[A-D]\)', line.strip()):
                question_lines.append(line.strip())
            else:
                break  # options begin, stop accumulating question
        return " ".join(question_lines)

    def get_options(self, obj):
        # Extracting options from the question text using regex
        question_text = obj.question_text
        options = extract_options_from_text(question_text)
        return options
       
# For Admin use
class GoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goals
        fields = '__all__' 

class MockTestSerializer(serializers.ModelSerializer):
    # questions = serializers.StringRelatedField(many=True)  # Include related questions as strings

    class Meta:
        model = MockTest
        fields = ['id','student', 'test', 'test_type', 'total_marks_obtained', 'nos_question', 'test_time', 'taken_at']
        
    

class SWOTanalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SWOTanalysis
        fields = ['test','student', 'strength', 'weakness', 'opportunity', 'threat']

class RankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ranking
        fields = ['student', 'test', 'rank_position']

class StudentDetailSerializer(serializers.ModelSerializer):
    mock_tests = MockTestSerializer(source='mocktest_set', many=True)  # Include all MockTests for the student
    swot_analysis = SWOTanalysisSerializer(source='swotanalysis_set', many=True)  # Include all SWOT analyses
    rankings = RankingSerializer(source='ranking_set', many=True)  # Include all rankings
    goals = GoalsSerializer()  # Include all goals

    class Meta:
        model = Student
        fields = ['id', 'student_name', 'student_email', 'student_phone_number','goals', 'mock_tests', 'swot_analysis', 'rankings']


# This will be used to get pop up about of the  1 test
class TestSerializer(serializers.ModelSerializer):
    # questions = serializers.StringRelatedField(many=True)  # Include related questions as strings

    class Meta:
        model = Test
        fields = ['id', 'test_type', 'total_marks_obtained', 'nos_question', 'test_time']


# This will give test id of all test is system  
class AllTestsSerializer(serializers.ModelSerializer):
    questions =  QuestionFrontendSerializer(many=True) # Include related questions as strings

    class Meta:
        model = Test
        fields = ['id', 'nos_question', 'test_time', 'syallabus', 'questions']



class StudentSerializer(serializers.ModelSerializer):
    student_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Student
        fields = ('student_name', 'student_email', 'student_phone_number', 'student_password')
    
    def create(self, validated_data):
        student = Student.objects.create(
            student_email=validated_data['student_email'],
            student_name=validated_data['student_name'],
            student_phone_number=validated_data['student_phone_number'],
            student_password=validated_data['student_password']
        )
        return student