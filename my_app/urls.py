from django.urls import path
from .views import (
    Subject_list,
    student_list,
    book_list,
    jee_advanced_students,
    jee_advanced_questions,
    get_question_with_answer,
    subject_question_counts,
    subject_with_max_questions,
    StudentRegistrationView,
    StudentListView,
    StudentLoginView,  # 🆕 Import login view
    Question_list,
    questionbank,
    pyq_questions,
    book_questions,
    student_profile,
    show_test_info,
    show_tests,
    get_avg_marks_of_test,
    get_student_marks,
    GoalsCreateView,
    SWOTCreateView,
     MockTestCreateView,
    RankingCreateView,
    SWOTanalysisCreateView

)
from django.http import JsonResponse

# Health check endpoint
def api_health_check(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('api/', api_health_check, name='api_health'),

    # API endpoints
    path('Subjects/', Subject_list),
    path('students/', student_list, name='student_list'),
    path('books/', book_list, name='book_list'),
    path('advance_students/', jee_advanced_students, name='jee_advanced_students'),
    path('jee-advanced-questions/', jee_advanced_questions, name='jee_advanced_questions'),
    path('question/<int:question_id>/', get_question_with_answer, name='get-question'),
    path('subject-counts/', subject_question_counts, name='subject-question-counts'),
    path('subject/max-questions/', subject_with_max_questions, name='subject-with-max-questions'),

    path('subject/max-questions/', subject_with_max_questions, name='subject-with-max-questions'),
    path('question/',Question_list),
    path('questionbank/', questionbank, name='questionbank'),
    path('pyq_questions/', pyq_questions, name='pyq_questions'),
    path('book_questions/', book_questions, name='book_questions'),
    path('student_profile/<int:student_id>/', student_profile, name='student_profile'),
    path('show_test_info/<int:test_id>/', show_test_info, name='show_test_info'),
    path('show_tests/', show_tests, name='show_tests'),
    path('get_avg_marks_of_test/', get_avg_marks_of_test, name='get_avg_marks_of_test'),
    path('get_student_marks/', get_student_marks, name='get_student_marks'),
    path('GoalsCreateView/', GoalsCreateView.as_view(), name='GoalsCreateView'),
    path('swot/', SWOTCreateView.as_view(), name='swot-create'),


    path('mocktests/create/', MockTestCreateView.as_view(), name='mocktest-create'),
    path('ranking/', RankingCreateView.as_view(), name='ranking-create'),
    path('swotanalysis/', SWOTanalysisCreateView.as_view(), name='swotanalysis-create'),

    # Auth endpoints
    path('register/', StudentRegistrationView.as_view(), name='student-register'),
    path('login/', StudentLoginView.as_view(), name='student-login'),  # 🆕 Login path

    # Student listing
    path('students/', StudentListView.as_view(), name='student-list'),
]
