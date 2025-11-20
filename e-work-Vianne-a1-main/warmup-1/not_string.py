def not_string(s):
    if s.startswith('not'):
        return s
    else:
        return 'not ' + s
