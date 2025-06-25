from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Subject
from .models import Student
from .models import Ranking
from .models import SWOTanalysis
from .serializers import GoalsSerializer, SubjectSerializer
from .serializers import StudentSerializer
from .models import Book
from .serializers import BookSerializer
from .serializers import StudentNameSerializer
from .models import Question
from .serializers import QuestionPYQSerializer
from .serializers import QuestionDetailSerializer
from .serializers import SubjectQuestionCountSerializer
from .serializers import RankingSerializer
from .serializers import SWOTanalysisSerializer
from django.db.models import Count
from .serializers import SubjectQuestionCountSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import StudentSerializer
from django.core.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password 
from .models import MockTest
from .models import Test
from .models import MockTestQuestion
from .serializers import TestSerializer
from .serializers import AllTestsSerializer
from django.db.models import Avg
from .serializers import QuestionSerializer
from .serializers import QuestionFrontendSerializer
from .serializers import QuestionFrontendPYQSerializer
from .serializers import QuestionFrontendBookSerializer
from .serializers import StudentDetailSerializer
from .serializers import MockTestSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import SWOTanalysisSerializer
from .models import SWOTanalysis






# Create your views here.

@api_view(['GET'])
def Subject_list(request):
    Subjects = Subject.objects.all()
    serializer = SubjectSerializer(Subjects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def Question_list(request):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def student_list(request):
    # Retrieve all student objects
    students = Student.objects.all()
    # Serialize the queryset
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def book_list(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def jee_advanced_students(request):
    # Filter students whose associated goals have exam 'JEE Advanced'
    advance_students = Student.objects.filter(goals__exam='JEE Advanced')
    serializer = StudentNameSerializer(advance_students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def jee_advanced_questions(request):
    questions = Question.objects.filter(pyq__exam_name='JEE Advanced')
    serializer = QuestionPYQSerializer(questions, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_question_with_answer(request, question_id):
    question = Question.objects.get(id=question_id)

    serializer = QuestionDetailSerializer(question)
    return Response(serializer.data)


@api_view(['GET'])
def subject_question_counts(request):
    subjects = Subject.objects.annotate(question_count=Count('question'))
    serializer = SubjectQuestionCountSerializer(subjects, many=True)
    return Response(serializer.data) 

@api_view(['GET'])
def subject_with_max_questions(request):
    subject = Subject.objects.annotate(
        question_count=Count('question')
    ).order_by('-question_count').first()
    
    if subject is None:
        return Response({"error": "No subjects found."}, status=404)
        
    serializer = SubjectQuestionCountSerializer(subject)
    return Response(serializer.data)

@api_view(['GET'])
def questionbank(request):
    # Extract query parameters
    subject_id = request.query_params.get('subject_id', None)
    level_mode = request.query_params.get('level_mode', None)
    question_type = request.query_params.get('type', None)

    # Filter questions based on provided parameters
    questions = Question.objects.all()
    if subject_id:
        questions = questions.filter(subject_id=subject_id)
    if level_mode:
        questions = questions.filter(level_mode=level_mode)
    if question_type:
        questions = questions.filter(type=question_type)
    serializer = QuestionFrontendSerializer(questions,many =True)
    return Response(serializer.data)

@api_view(['GET'])
def pyq_questions(request):
    # Extract query parameters
    subject_id = request.query_params.get('subject_id', None)
    level_mode = request.query_params.get('level_mode', None)
    year_num = request.query_params.get('year_num', None)

    # Filter questions based on provided parameters
    questions = Question.objects.all()
    if subject_id:
        questions = questions.filter(subject_id=subject_id)
    if level_mode:
        questions = questions.filter(level_mode=level_mode)
    if year_num:
        questions = questions.filter(pyq__year_num=year_num)
    serializer = QuestionFrontendPYQSerializer(questions,many =True)
    return Response(serializer.data)

@api_view(['GET'])
def book_questions(request):
    # Extract query parameters
    book_name = request.query_params.get('book_name', None)
    question_type = request.query_params.get('type', None)
    subject_id = request.query_params.get('subject_id', None)

    # Filter questions based on provided parameters
    questions = Question.objects.all()
    if book_name:
        questions = questions.filter(book__book_name=book_name)
    if subject_id:
        questions = questions.filter(subject_id=subject_id)
    if question_type:
        questions = questions.filter(type=question_type)
    serializer = QuestionFrontendBookSerializer(questions,many =True)
    return Response(serializer.data)

@api_view(['GET'])
def student_profile(request, student_id):
    # Retrieve a specific student object by ID
    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return Response({"error": "Student not found."}, status=404)
    serializer = StudentDetailSerializer(student)
    return Response(serializer.data)


@api_view(['GET'])
def show_test_info(request, test_id):
    # Retrieve all mock tests
    test = MockTest.objects.get(id=test_id)
    serializer = TestSerializer(test)
    return Response(serializer.data)

@api_view(['GET'])
def show_tests(request):  
    # Retrieve all mock tests
    tests = Test.objects.all()
    serializer = AllTestsSerializer(tests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_questions_by_test(request, test_id):
    # Retrieve all questions for a specific test
    questions = MockTestQuestion.objects.filter(mock_test_id=test_id)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_avg_marks_of_test(request):
    test_id = request.query_params.get('test_id', None)
    if test_id:
        avg_marks = MockTest.objects.filter(id=test_id).aggregate(avg_marks=Avg('total_marks_obtained'))
        return Response({"id": test_id, "avg_marks": avg_marks['avg_marks'] if avg_marks['avg_marks'] is not None else 0})
    else:
        return Response({"error": "Test ID not provided."}, status=400)
    
@api_view(['GET'])
def get_student_marks(request):
    student_id = request.query_params.get('student_id', None)
    test_id = request.query_params.get('test_id', None)
    if student_id and test_id:
        try:
            mock_test = MockTest.objects.get(id=test_id, student__id=student_id)
            marks_obtained = mock_test.total_marks_obtained
        except MockTest.DoesNotExist:
            return Response({"error": "No matching test or student found."}, status=404)
        return Response({"id": test_id, "marks_obtained": marks_obtained if marks_obtained is not None else 0})
    else:
        return Response({"error": "Student ID or Test ID not provided."}, status=400)


class StudentRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Debug logging
        print("Received registration data:", request.data)
        
        # Check if user already exists
        email = request.data.get('student_email')
        phone = request.data.get('student_phone_number')
        
        if Student.objects.filter(student_email=email).exists():
            return Response(
                {'message': 'A user with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if Student.objects.filter(student_phone_number=phone).exists():
            return Response(
                {'message': 'A user with this phone number already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = StudentSerializer(data=request.data)
        try:
            # Print debug information
            print("Is data valid:", serializer.is_valid())
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                
            if serializer.is_valid():
                student = serializer.save()
                return Response({
                   
                    'student': {
                        'id': student.id,
                        'student_name': student.student_name,
                        'student_email': student.student_email
                    }
                }, status=status.HTTP_201_CREATED)
            return Response(
                {'message': 'Validation failed', 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            print("Validation error:", str(e))
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class StudentListView(APIView):
    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    


class StudentLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('student_email')
        password = request.data.get('student_password')

        try:
            student = Student.objects.get(student_email=email)
            refresh = RefreshToken.for_user(student)
            access_token = str(refresh.access_token)
            if student.student_password == password:  # Replace with check_password(...) if hashing
                return Response({
                    'token': access_token,
                    'student': {
                        'id': student.id,
                        'student_name': student.student_name,
                        'student_email': student.student_email
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Student.DoesNotExist:
            return Response({'code': 'student_not_found', 'detail': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    


class GoalsCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoalsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Goal created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "message": "Goal creation failed",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class SWOTCreateView(APIView):
    def post(self, request):
        serializer = SWOTanalysisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'SWOT analysis saved successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class MockTestCreateView(generics.CreateAPIView):
    queryset = MockTest.objects.all()
    serializer_class = MockTestSerializer

    def perform_create(self, serializer):
        try:
            student = Student.objects.get(id=self.request.data['student'])
            test = Test.objects.get(id=self.request.data['test'])
            serializer.save(student=student, test=test)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Test.DoesNotExist:
            return Response({"error": "Test not found"}, status=status.HTTP_400_BAD_REQUEST)

class RankingCreateView(generics.CreateAPIView):
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer

# API endpoint for creating a SWOTanalysis entry
class SWOTanalysisCreateView(generics.CreateAPIView):
    queryset = SWOTanalysis.objects.all()
    serializer_class = SWOTanalysisSerializer