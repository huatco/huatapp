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
    z = [-1] * count 
    exp_rem = [] #expected value remaining

    for i in range(count):
        planned_earnings = targetdiv[i]*current_time        
        cum_earnings_index = float(planned_earnings/float(E[i]))
        exp_rem.append(float((X[i]-planned_earnings)/cum_earnings_index))

    portfolio_val = P+sum(E)
    cons = []
    objective = percentages + z
    print "objective", objective


    cons.append({ 'type' : 'eq',
                'fun' : lambda p: np.array([sum(p[:count])-1]),
                'jac' : lambda p: np.array([1] * count + [0] * count)})
    cons.append({ 'type' : 'ineq',
                'fun' : lambda p: np.array([M[0] * (exp_rem[0]-X[0] + portfolio_val*p[0]) - p[2]]),
                'jac' : lambda p: np.array([portfolio_val, 0, -1, 0])})
    cons.append({ 'type' : 'ineq',
                'fun' : lambda p: np.array([M[1] * (exp_rem[1]-X[1] + portfolio_val*p[1]) - p[3]]),
                'jac' : lambda p: np.array([0, portfolio_val, 0, -1])})

    for i in range(count):
        cons.append({ 'type' : 'ineq',
                'fun' : lambda p: np.array([-1 * p[i + count]]),
                'jac' : lambda p: np.array([0]*(count + i)+[1]+[0]*(count-i-1))})

    cons.append({ 'type' : 'ineq',
                'fun' : lambda p: np.array([p[0]]),
                'jac' : lambda p: np.array([1, 0, 0, 0])})
    cons.append({ 'type' : 'ineq',
                'fun' : lambda p: np.array([p[1]]),
                'jac' : lambda p: np.array([0, 1, 0, 0])})


    def func(p, sign=-1.0):
        return sign*(p[2] + p[3])
    
    res = minimize(func, objective, constraints=cons, method = 'SLSQP', options={'disp':True})
    #res = minimize(func, objective, constraints=cons)
    print res.x[0] + res.x[1]
    print res.x[0] * portfolio_val
    print res.x[1] * portfolio_val
    return res


def main():
    no_of_goals = 2
    X = [300, 150] #Target value for goal i
    M = [1, 6] #Priority level for goal i
    E = [10,20,30] #Amount earned for goal i
    T = [100, 50] #Target time for completion of goal i
    P = 100 #Principal Amount invested by the user
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
