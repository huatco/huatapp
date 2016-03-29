## Goal Sorting

import numpy as np
from scipy.optimize import minimize

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
    print "objective", objective

    bds = [(0, None)] * count + [(None, 0)]*count 
    cons.append({ 'type' : 'eq', # sum(pi) == 1
                'fun' : lambda p: np.array([sum(p[:count])-1]),
                'jac' : lambda p: np.array([1] * count + [0] * count)})

    # mi(ERE + vpi - xi) - zi > 0
    for i in range(count):
        cons.append({ 'type' : 'ineq',
                'fun' : lambda p, i=i: np.array([M[i] * (exp_rem[i]-X[i] + portfolio_val*p[i]) - p[count + i]]),
                'jac' : lambda p, i=i: np.array([0]*i + [portfolio_val] + [0]*(count-i-1) + [0]*i + [-1] + [0]*(count-i-1))})
    print len(cons)

    def func(p, sign=-1.0):
        sum = 0
        for i in range(count):
            sum = sum + p[i + count]
        return sign*(sum)
    
    res = minimize(func, objective, constraints=cons, method = 'SLSQP', options={'disp':True, 'maxiter':300}, bounds = bds)
    #res = minimize(func, objective, constraints=cons)
    print "portfolio amount", portfolio_val
    print "allocation: "
    for i in range(count):
        print "Goal", i+1, ":", res.x[i] * portfolio_val 
    for i in range(count):
        print exp_rem[i]
    return res


def main():
    no_of_goals = 2
    X = [300,150] #Target value for goal i
    M = [1,2] #Priority level for goal i
    E = [1,2,3,10,9] #Amount earned for goal i
    T = [10,8] #Target time for completion of goal i
    P = 10 #Principal Amount invested by the user
    percentages = []

    for i in range(no_of_goals):
        percentages.append(1/float(no_of_goals))
    
    current_time = 5
    print percentages
    div = goal_division(X,T)
    print div

    res = allocation(P,X,M,E,div,current_time,percentages)
    print res.x
        
main()
