import numpy
import copy

def data_variable_creator(no_of_goals, Completion_time, current_time, previous_percentage, portfolio_value, weights, target):

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
    for i in range(no_of_goals):
        b[i,0] = -1*(U[i]+y[i])
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

    c_bar = numpy.zeros_like(c)
    optimum = False
    while optimum == False:
        c_bar = c - numpy.dot(y_b,A)
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
        c_b = numpy.zeros_like(x_b)
        for i in range(len(x_b)):
            c_b[i] = -1*c[x_b[i]]
        y_b = copy.deepcopy(c_b)
        print y_b
        b_bar = numpy.dot(numpy.linalg.inv(Ab2),b)
        A = numpy.transpose(A)
    print x_b
    print b_bar
    
    
def main():
    no_of_goals = 3
    Completion_time = [10, 12, 15]
    current_time = 5
    previous_percentage = [0.8,0.1,01]
    Principal = 5
    Earnings = [1,2,0,0,2]
    portfolio_value = Principal + sum(Earnings)
    weights = [1, 2, 3]
    target = [20, 20.8, 22]
    data_variable_creator(no_of_goals, Completion_time, current_time, previous_percentage, portfolio_value, weights, target)
