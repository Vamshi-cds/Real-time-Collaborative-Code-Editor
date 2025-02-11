from enum import Enum


class Operations(Enum):
    Addition = 'Addition'
    Deletion = 'Deletion'
    Replace = 'Replace'
def apply_change(data, op,change_range, new_chars ):
    if op == Operations.Addition:
        data = data[0:change_range[0]] + new_chars +data[change_range[0]:]
    elif op == Operations.Deletion:
        data = data[0:change_range[0]] + data[change_range[1]+1:]
    else:
        data = data[0:change_range[0]] +new_chars + data[change_range[1]+1:]

    return data

print(apply_change('abef', Operations.Addition, (4,4), 'cd'))
print(apply_change('abef', Operations.Deletion, (0,1), ''))
print(apply_change('abef', Operations.Replace, (0,0), 'cd'))




