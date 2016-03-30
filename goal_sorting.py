## Goal Sorting

import numpy as np
from scipy.optimize import minimize
from pymongo import MongoClient
import sys

def goal_division(X,T):
    targetdiv = [] #Target value for goal i per timestep
    for i in range(len(X)):
        targetdiv.append(float(X[i])/float(T[i]))
    return targetdiv
    

def allocation(P,X,M,E,targetdiv,current_time,percentages):
    count = len(M)
    z = [0] * count 
    exp_rem = [] #expected remaining earnings
    portfolio_val = P+sum(E)
    for i in range(count):
        planned_earnings = targetdiv[i]*current_time        
        cum_earnings_index = float(planned_earnings/(percentages[i]*portfolio_val))
        exp_rem.append(float((X[i]-planned_earnings)/cum_earnings_index))
    
    cons = []
    objective = percentages + z

    bds = [(0, None)] * count + [(None, 0)]*count 
    cons.append({ 'type' : 'eq', # sum(pi) == 1
                'fun' : lambda p: np.array([sum(p[:count])-1]),
                'jac' : lambda p: np.array([1] * count + [0] * count)})

    # mi(ERE + vpi - xi) - zi > 0
    for i in range(count):
        cons.append({ 'type' : 'ineq',
                'fun' : lambda p, i=i: np.array([M[i] * (exp_rem[i]-X[i] + portfolio_val*p[i]) - p[count + i]]),
                'jac' : lambda p, i=i: np.array([0]*i + [portfolio_val] + [0]*(count-i-1) + [0]*i + [-1] + [0]*(count-i-1))})
    def func(p, sign=-1.0):
        sum = 0
        for i in range(count):
            sum = sum + p[i + count]
        return sign*(sum)
    
    save_stdout = sys.stdout
    sys.stdout = open('trash', 'w')
    res = minimize(func, objective, constraints=cons, method = 'SLSQP', options={'disp':True, 'maxiter':300}, bounds = bds)
    sys.stdout = save_stdout
    #res = minimize(func, objective, constraints=cons)
    for i in range(count):
        print res.x[i] * portfolio_val 
    return res


def main():
    username = sys.argv[1]
    url = sys.argv[2]
    client = MongoClient(url)
    db = client['meteor']
    goal = db['goals']
    user = db['users']
    ids = []
    X = []
    M = []
    no_of_goals = goal.count({'user': username})
    for g in goal.find({'user': username}):
        X.append(float(g['amount']))
        M.append(float(g['priority']))
        ids.append(g['_id'])
    this_user = user.find({'username': username})
    for u in this_user:
        P = float(u['profile']['amount'])
    #no_of_goals = 2
    #X = [300,150] #Target value for goal i
    #M = [1,2] #Priority level for goal i
    E = [0,0,0,0,0] #Amount earned for goal i
    T = [10] * no_of_goals #Target time for completion of goal i
    #P = 10 #Principal Amount invested by the user
    percentages = []

    for i in range(no_of_goals):
        percentages.append(1/float(no_of_goals))
    
    current_time = 5
    
    div = goal_division(X,T)
    portfolio_val = P+sum(E)
    print "portfolio_val", portfolio_val
    res = allocation(P,X,M,E,div,current_time,percentages)
    print ids
    for i in range(no_of_goals):
        amount = goal.find_one({'_id': ids[i]})['amount'];
        current = res.x[i] * portfolio_val
        progress = current / float(amount)
        print "current", current
        print "progress", progress
        goal.find_one_and_update({'_id': ids[i]}, {'$set': {'current': current}})
        goal.find_one_and_update({'_id': ids[i]}, {'$set': {'progress': progress}})
main()
