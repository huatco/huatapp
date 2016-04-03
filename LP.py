import numpy
import copy
from pymongo import MongoClient
import sys

def lp_solver(no_of_goals, Completion_time, current_time, previous_percentage, portfolio_value, weights, target):

    ere = []
    y = []
    U = []
    
    for i in range(no_of_goals):
        
        ere.append((float(Completion_time[i] - current_time)/current_time)*previous_percentage[i]*portfolio_value)
    
        y.append(weights[i]*portfolio_value)
    
        U.append(weights[i]*(ere[i] - target[i]))

    I = numpy.identity(no_of_goals)

    Y = numpy.identity(no_of_goals);
        
    for i in range(no_of_goals):
        Y[i,i] = y[i]

    Y[0,0] = 0
    for i in range(1,no_of_goals):
        Y[0,i] = -1*y[0]

    negI = numpy.identity(no_of_goals)
    for i in range(len(I)):
        negI[i,i] = -1
        
    A = []
    A = numpy.hstack((I,Y,negI))

    a = numpy.zeros(len(A[1]))
    for i in range(no_of_goals,2*no_of_goals):
        a[i]= 1
    
    A = numpy.vstack((A,a))

    b = numpy.zeros((no_of_goals+1,1))
    b[0,0] = -1*(U[0] + y[0])
    for i in range(1,no_of_goals):
        b[i,0] = -1*(U[i])
    b[no_of_goals,0] = 1
    
    c = numpy.zeros(len(A[1]))
    for i in range(no_of_goals,2*no_of_goals):   
        c[i] = y[i-no_of_goals] - y[0]
    
    for i in range(2*no_of_goals,len(c)):
        c[i] = -1

    y_b = numpy.zeros(no_of_goals+1)

    x_b = numpy.zeros(no_of_goals+1)
    for i in range(len(x_b)):
        x_b[i] = i

    b_bar = numpy.zeros((no_of_goals+1,1))
    b_bar = copy.deepcopy(b)

    Ab = numpy.identity(no_of_goals+1)

    c_bar = copy.deepcopy(c)
    optimum = False
    
    while optimum == False:
        
        k = -1 
        for i in range(len(c_bar)):
            if c_bar[i] >0:
                k = i
                break
        
        if k == -1:
            optimum = True
            break
        
        Ak = numpy.zeros((no_of_goals+1,1))
        for i in range(no_of_goals+1):
            Ak [i,0] = A[i,k]
        
        
        Ab_inv = numpy.linalg.inv(Ab)
        A_bar_k = numpy.dot(Ab_inv,Ak)
        
        ratios = []
        counter = False
        for i in range(len(A_bar_k)):
            if A_bar_k[i,0] <=0:
                ratios.append(10000000)
            if A_bar_k[i,0] >0:
                ratios.append(b_bar[i,0]/A_bar_k[i,0])
                counter = True
        h = 0
        if counter == False:
            print "unbounded"
        for i in range(len(ratios)):        
                if ratios[i] == min(ratios):
                    h=i

        x_b[h] = k
        
        A = numpy.transpose(A)
        Ab2 = numpy.empty_like(A[0])
        
        for i in range(len(x_b)):
            Ab2 = numpy.vstack((Ab2,A[x_b[i]]))
        
        Ab2 = numpy.delete(Ab2,0,0)
        Ab2 = numpy.transpose(Ab2)
        Ab = copy.deepcopy(Ab2)

        
        c_b = numpy.zeros_like(x_b)
        for i in range(len(x_b)):
            if c[x_b[i]] !=0:
                c_b[i] = -1*c[x_b[i]]
            else:
                c_b[i] = 0
        y_b = copy.deepcopy(c_b)
        b_bar = numpy.dot(numpy.linalg.inv(Ab2),b)
        
        A = numpy.transpose(A)
        c_bar = numpy.dot(y_b,A)
        
    return (x_b,b_bar)
    
    
    
def main():

    username = sys.argv[1]
    url = sys.argv[2]
    client = MongoClient(url)
    #connecting to running mongoDB
    db = client['meteor']
    goal = db['goals']
    user = db['users']

    ids = []
    target = [] 
    Completion_time = []
    previous_percentage = []
    weights = [] #priorities
    no_of_goals = goal.count({'user': username})
    for g in goal.find({'user': username}):
        target.append(float(g['target_amount']))
        weights.append(float(g['priority']))
        Completion_time.append(int(g['goal_month']) + 12 * (int(g['goal_year']) - int(g['current_year'])))
        previous_percentage.append(g['progress'])
        ids.append(g['_id'])
    this_user = user.find({'username': username})
    for u in this_user:
        Principal = float(u['profile']['amount'])

    #stuff SHOULD be from the database
    Earnings = [1,2,3,10,9]
    current_time = 5

    #previous_percentage = [0.3, 0.3, 0.4]
    #no_of_goals = 3
    #Completion_time = [10, 8, 15]
    #Principal = 10
    #weights = [1, 2, 1]
    #target = [300,150,650]
    
    portfolio_value = Principal + sum(Earnings)
<<<<<<< HEAD
    weights = [1, 2,1]
    target = [300,150,650]
    z_indices = []
    p_indices = []
    z = []
    p = []
=======
>>>>>>> origin/develop

    objectives = ()
    objectives = lp_solver(no_of_goals, Completion_time, current_time, previous_percentage, portfolio_value, weights, target)
    x_b = []
    x_b = objectives[0]

    b_bar = []
    b_bar = objectives[1]


    
    for i in range(no_of_goals):
        z.append(0)
        p.append(0)
    for i in range(no_of_goals):
        z_indices.append(i)
        p_indices.append(i+no_of_goals)
    for i in range(len(x_b)):
        if x_b[i] in z_indices:
            z[int(x_b[i])] = b_bar[i,0]
        elif x_b[i] in p_indices:
            p[int(x_b[i])-no_of_goals] = b_bar[i,0]
    print p

    for i in range(no_of_goals):
        amount = goal.find_one({'_id': ids[i]})['amount'];
        current = p[i] * portfolio_val
        progress = current / float(amount)
        print "current", current
        print "progress", progress
        goal.find_one_and_update({'_id': ids[i]}, {'$set': {'current_amount': current}})
        goal.find_one_and_update({'_id': ids[i]}, {'$set': {'progress': progress}})
main()
            
        
        
