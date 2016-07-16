import string 
import random
N = 12 
f = "["
for i in range(50):
	f += '"' + ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for _ in range(N)) + '",'

print f + '];'
