function sumArray(arr){
   return arr.reduce((sum, num) => sum + num, 0);
}

function avg(arr){
       return arr.length ? sumArray(arr) / arr.length : 0;
}

function objArraySum(obj){
    let result = {};
    Object.entries(obj).forEach(([key, value]) => {
        result[key] = sumArray(value);
    });
    return result;
}

function countOccurrences(arr){
    let result = {};
    arr.forEach(item =>{
        if(result[item]){
            result[item] += 1;
        } else {
            result[item] = 1;
        }
    })
    return result;
}

function swapkeyValue(obj){
    let result = {};
    Object.entries(obj).forEach(([key, value]) => {
        result[value] = key;
    });
    return result;
}

function largestValueKey(obj){
    let keyOfLargestValue= null;
    let largestValue = -Infinity;
    Object.entries(obj).forEach(([key, value]) => {
        if(value > largestValue){
            largestValue = value;
            keyOfLargestValue = key;
        }
    })
    return keyOfLargestValue;
}

function flattenObjArrays(obj){
    let result = [];
    Object.values(obj).forEach(arr => {
        if(Array.isArray(arr)) result.push(...flattenObjArrays(arr));
        else result.push(arr);
    })
    return result;
}

function groupPeopleByCity(peopleArray) {
    const result = {};

    peopleArray.forEach(({ name, city }) => {
        if (!result[city]) {
            result[city] = [];
        }
        result[city].push(name); 
    });

    return result;
}



function filterByValueGTFifty(obj){
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value > 50)
    );
}


function highestAvgMarks(students){
    let result = {student: '', avgMarks: 0};
    Object.entries(students).forEach(([key, val])=>{
        let curStudentAvgMarks = avg(val);
        if(curStudentAvgMarks > result.avgMarks){
            result.student = key;
             result.avgMarks = curStudentAvgMarks;
        }
    }) 
    return result.student;
}

function uniqueValueAcrossObjArrays(obj){
    return [...new Set(Object.values(obj).flat())];
}

function pickKeys(obj, [key1, key2]){
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => {
            return key === key1 || key === key2;
        })
    )
}

let input1 = { food: [10, 20, 30], travel: [5, 15], bills: [40, 60] };
let input2 = ["apple", "banana", "apple", "orange", "banana", "apple"];
let input3 = { a: "x", b: "y", c: "z" };
let input4 = { a: 10, b: 50, c: 20 };
let input5 = { fruits: ["apple", "banana"], veggies: ["carrot", "pea"] }
let input6 = [
  { name: "A", city: "Delhi" },
  { name: "B", city: "Mumbai" },
  { name: "C", city: "Delhi" }
]
let input7 = { a: 20, b: 60, c: 40, d: 90 };
let input8 = { A: [80, 90], B: [70, 75, 85] };
let input9 = { x: [1,2,3], y: [2,3,4], z: [4,5] }
let input10 = { name: "Rahul", age: 23, city: "Noida" };
let input10_a = ["name","city"];



console.log(objArraySum(input1)); 
console.log(countOccurrences(input2)); 
console.log(swapkeyValue(input3));
console.log(largestValueKey(input4));
console.log(flattenObjArrays(input5));
console.log(groupPeopleByCity(input6));
console.log(filterByValueGTFifty(input7));
console.log(highestAvgMarks(input8));
console.log(uniqueValueAcrossObjArrays(input9))
console.log(pickKeys(input10, input10_a));

