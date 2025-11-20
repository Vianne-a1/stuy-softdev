def parrot_trouble(talking, hour):
  if (talking == True):
    if (hour < 7 or hour > 20):
      return True
    return False
  else: 
    return False
