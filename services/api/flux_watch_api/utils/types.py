from typing import get_type_hints


class GetTypeHintOf:
    def __init__(self, name, or_use_nested_class: str = None):
        self.name = name
        self.nested_class_name = or_use_nested_class

    def __get__(self, instance, owner):
        if self.nested_class_name and self.nested_class_name in owner.__dict__:
            return getattr(owner, self.nested_class_name)
        return get_type_hints(owner)[self.name]
