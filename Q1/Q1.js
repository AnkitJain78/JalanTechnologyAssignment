/*
Write a program that takes as input an array of numbers – positive and negative. The objective is to
return the array arranged in an alternate order such that every positive number is followed by a
negative number throughout.

Example Test Case 1:

Input: [-3, 1, 2, 4, -6, 8, -8, -1]
Output: [1, -3, 2, -6, 4, -8, 8, -1]


Example Test Case 2:

Input: [-3, 1, 2, 4, -6, 8, -8, -1, -3, -4, -5, -6, -7]
Output: [1, -3, 2, -6, 4, -8, 8, -1, -3, -4, -5, -6, -7]


Time Complexity: O(n)
Space Complexity: O(n)
*/

/**
 * Alternates positive and negative numbers within the input array.
 * @author Ankit Jain
 * @description This function implements a logic to rearrange the positive and negative elements within the given input array.
 * @param {number[]} arr - An array containing positive and negative numbers.
 * @returns {number[]} - The array with positive and negative numbers alternately arranged.
 */
function alternateArrangement(arr) {
    const positiveNumbers = arr.filter((num) => num > 0);
    const negativeNumbers = arr.filter((num) => num < 0);
    let output = [];
    let i = 0,
      j = 0;
    while (i < positiveNumbers.length && j < negativeNumbers.length) {
      output.push(positiveNumbers[i++]);
      output.push(negativeNumbers[j++]);
    }
    while (i < positiveNumbers.length) {
      output.push(positiveNumbers[i++]);
    }
    while (j < negativeNumbers.length) {
      output.push(negativeNumbers[j++]);
    }
    return output;
  }
  
  const inputOne = [-3, 1, 2, 4, -6, 8, -8, -1];
  const inputTwo = [-3, 1, 2, 4, -6, 8, -8, -1, -3, -4, -5, -6, -7];
  const output = alternateArrangement(inputOne);
  const outputTwo = alternateArrangement(inputTwo);
  console.log("Output One: ", output);
  console.log("Output Two: ", outputTwo);