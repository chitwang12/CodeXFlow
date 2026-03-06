//Each test case inside a problem 
export interface TestCase {
    _id: string,
    input: string,    //eg "2 3\n1 2 3\n4 5 6" (for a problem that takes a matrix as input)
    output: string     //eg "6" (for a problem that requires summing the elements of the matrix)
}


export interface Problem {
    _id: string,
    title: string,    //eg "Sum of Matrix Elements"
    description: string,   //eg "Given a matrix of integers, calculate the sum of all its elements."
    inputFormat: string,   //eg "The first line contains two integers n and m, representing the number of rows and columns in the matrix. The next n lines each contain m integers, representing the elements of the matrix."
    outputFormat: string,  //eg "Output a single integer, the sum of all elements in the matrix."
    sampleTestCases: TestCase[],  //eg [{ input: "2 3\n1 2 3\n4 5 6", output: "21" }]
     difficulty: 'Easy' | 'Medium' | 'Hard',  //eg "Easy"
     tags: string[]   //eg ["Matrix", "Summation"]
}