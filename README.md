# mylang

A programming language I wrote for educational purposes.

Its a very simple, dynamic language which relies heavily on functions and immutable data structures.

## Data Types:
- int
- float
- string
- boolean
- nil
- functions
- set
- list
- dict (map)

## Defining values
In order to define a value (give it a name), use the `let statement`:
```
let x 1 ; x now holds the value of 1, and can't be changed
let y true

let sum [a b] (+ a b)
let sum-and-print [a b] {
  let result (+ a b)
  (println result)

  return result
}
```

NOTE that once a name is set with a value, it can't be changed.

## Control flow
The `if statement` can be used for codne branching.

```
let zero-if-negative-otherwise-add-one [n] {
  if (> n 0) {
    return 0
  } elsif false {
    (println "wont ever get here")
  } else {
    retun (+ n 1)
  }
}
```

There are no loops. Recursion can be used:
```
let fib [n] {
  if (= n 0) {
    return 0
  } elsif (= n 1) {
    return 1
  } else {
    let a (fib (- n 1))
    return (+ (fib (- n 1)) (fib (- n 2)))
  }
}
```
