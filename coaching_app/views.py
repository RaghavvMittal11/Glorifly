from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

def homepage(request):
    return render(request, 'homepage.html')

def book(request):
    return render(request, 'book.html')

def pyq(request):
    return render(request, 'pyq.html')

def login(request):
    return render(request, 'login.html')
  
def register(request):
    return render(request, 'register.html')

def syllabus(request):
    return render(request, 'syllabus.html')

def submit(request):
    return render(request, 'submit.html')

def goals(request):
    return render(request, 'goals.html')

def tests(request):
    return render(request, 'tests.html')

def perfomance(request):
    return render(request, 'perfomance.html')