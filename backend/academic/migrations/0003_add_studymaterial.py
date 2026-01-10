from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0002_alter_admitcard_options_alter_enrollment_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudyMaterial',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('file_path', models.FileField(blank=True, null=True, upload_to='study_materials/%Y/%m/')),
                ('file_type', models.CharField(
                    choices=[
                        ('lecture_notes', 'Lecture Notes'),
                        ('assignment', 'Assignment'),
                        ('syllabus', 'Syllabus'),
                        ('book', 'Book'),
                        ('video_lecture', 'Video Lecture'),
                        ('tutorial', 'Tutorial'),
                        ('presentation', 'Presentation'),
                        ('code', 'Code/Project'),
                        ('dataset', 'Dataset'),
                        ('other', 'Other'),
                    ],
                    default='lecture_notes',
                    max_length=50
                )),
                ('file_size', models.BigIntegerField(default=0)),
                ('access_level', models.CharField(
                    choices=[
                        ('public', 'Public'),
                        ('enrolled_only', 'Enrolled Students Only'),
                    ],
                    default='enrolled_only',
                    max_length=20
                )),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('is_visible', models.BooleanField(default=True)),
                ('download_count', models.IntegerField(default=0)),
                ('view_count', models.IntegerField(default=0)),
                ('tags', models.CharField(blank=True, max_length=500, null=True)),
                ('offering', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='study_materials',
                    to='academic.courseoffering'
                )),
                ('uploaded_by_faculty', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='uploaded_materials',
                    to='academic.facultymember'
                )),
            ],
            options={
                'ordering': ['-uploaded_at'],
            },
        ),
    ]