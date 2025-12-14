from django.urls import path
from .views import login_account, register_account


urlpatterns = [
    path('register/', register_account , name='register'),
    path('login/', login_account, name='login'),

]
