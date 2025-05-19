from django.db import models
from django.db.models import Avg
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


class MovieOrSeries(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")
    short_description = models.TextField(verbose_name="Короткое описание")
    full_description = models.TextField(verbose_name="Полное описание")
    critic_rating = models.FloatField(verbose_name="Оценка критиков")
    release_date = models.DateField(verbose_name="Дата релиза")
    is_series = models.BooleanField(default=False, verbose_name="Это сериал?")
    episodes_count = models.JSONField(default=dict,
                                      blank=True,
                                      verbose_name="Количество эпизодов"
                                      "по сезонам")
    poster = models.ImageField(upload_to='posters/', verbose_name="Постер")
    trailer = models.FileField(upload_to='trailers/', verbose_name="Трейлер")

    class Meta:
        verbose_name = "Фильм/Сериал"
        verbose_name_plural = "Фильмы/Сериалы"

    def __str__(self):
        return self.title

    @property
    def user_rating(self):
        from .models import Review
        average = Review.objects.filter(
            watch_log__movie_or_series=self
        ).aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(average, 2) if average is not None else 0

    @property
    def total_episodes(self):
        if self.is_series and self.episodes_count:
            return sum(self.episodes_count.values())
        return 1


class WatchStatus(models.TextChoices):
    WATCHING = 'watching', 'Смотрю'
    PLANNED = 'planned', 'Запланировано'
    COMPLETED = 'completed', 'Просмотрено'
    DROPPED = 'dropped', 'Брошено'
    ON_HOLD = 'on_hold', 'Отложено'


class WatchLog(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Пользователь")
    movie_or_series = models.ForeignKey(
        MovieOrSeries, on_delete=models.CASCADE, verbose_name="Фильм/Сериал")
    total_episodes = models.PositiveIntegerField(verbose_name="Всего серий",
                                                 blank=True)
    watched_episodes = models.PositiveIntegerField(
        default=0, verbose_name="Просмотрено серий")
    status = models.CharField(
        max_length=20,
        choices=WatchStatus.choices,
        default=WatchStatus.PLANNED,
        verbose_name="Статус просмотра"
    )

    class Meta:
        verbose_name = "Запись дневника просмотра"
        verbose_name_plural = "Дневник просмотра"
        unique_together = ('user', 'movie_or_series')

    def __str__(self):
        return f"{self.user.username} — {self.movie_or_series.title} \
        ({self.get_status_display()})"

    def clean(self):
        if not self.total_episodes:
            if self.movie_or_series.is_series:
                episodes_data = self.movie_or_series.episodes_count or {}
                self.total_episodes = sum(episodes_data.values())
            else:
                self.total_episodes = 1

        if self.watched_episodes > self.total_episodes:
            raise ValidationError(
                {'watched_episodes': f'Просмотренные \
                 серии ({self.watched_episodes}) не могут быть \
                 больше чем всего серий ({self.total_episodes}).'}
            )

    def save(self, *args, **kwargs):
        self.full_clean()

        if ((self.watched_episodes == self.total_episodes)
                and self.total_episodes) != 0:
            self.status = WatchStatus.COMPLETED

        super().save(*args, **kwargs)


class Review(models.Model):
    watch_log = models.ForeignKey(
        WatchLog, on_delete=models.CASCADE, verbose_name="Дневник просмотра")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Пользователь")
    rating = models.FloatField(
        verbose_name="Оценка пользователя", help_text="Оценка от 0 до 10")
    content = models.TextField(verbose_name="Текст отзыва")

    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        unique_together = ('watch_log', 'user')

    def __str__(self):
        return f"Отзыв от {self.user.username} \
        на {self.watch_log.movie_or_series.title}"

    def clean(self):
        if not (0 <= self.rating <= 10):
            raise ValidationError({'rating': 'Оценка должна быть от 1 до 10.'})
