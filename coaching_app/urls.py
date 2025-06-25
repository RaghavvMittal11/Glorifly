"""
URL configuration for coaching_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    # Admin URLs
    path('admin/', admin.site.urls),
    
    # Template view URLs
    path('', views.index, name='index'),                   # Renders index.html
    path('homepage/', views.homepage, name='homepage'),    # Renders homepage.html
    path('book/', views.book, name='book'),
    path('register/', views.register, name='register'),    # Renders register.html
    path('login/', views.login, name='login'),            # Renders login.html 
    path('pyq/', views.pyq, name='pyq'),
    path('syllabus/', views.syllabus, name='syllabus'),
    path('submit/', views.submit, name='submit'),    
    path('goals/',views.goals,name='goals'),
     path('tests/', views.tests, name='tests'),
    path('perfomance/', views.perfomance, name='perfomance'),
    
    path('api/',include('my_app.urls')),  
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)