from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.utils.deconstruct import deconstructible
import os


@deconstructible
class File_Rename(object):
    def __init__(self, sub_path, arg_name):
        self.path = sub_path
        self.newName = arg_name
    def __call__(self, instance, file_name):
        ext = file_name.split('.')[-1]
        from django.utils.text import slugify
        file_name = f'{slugify(getattr(instance, self.newName))}.{ext}'
        return os.path.join(self.path, file_name)


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, full_path, max_length=None):
        if self.exists(full_path):
            os.remove(os.path.join(settings.MEDIA_ROOT, full_path))
        return full_path