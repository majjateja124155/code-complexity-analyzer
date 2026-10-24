/**
 * Presets Library for CodeComplex
 * Curated algorithm samples with full multi-language implementations:
 * Python, C++, C, Java, JavaScript, and Go.
 */

export const PRESETS = [
  {
    id: 'coin-change-dp',
    name: 'Coin Change (Unbounded DP)',
    subname: 'Dynamic Programming',
    category: 'Pseudo-Polynomial O(n * amount)',
    timeComplexity: 'O(n * amount)',
    spaceComplexity: 'O(amount)',
    description: 'Computes the minimum number of coins needed to make a target amount using a bottom-up 1D dynamic programming approach (the classic unbounded Coin Change problem).',
    timeExplanation: "The algorithm executes an outer loop iterating from 1 to 'amount' and an inner loop iterating through all n coins. Each inner step performs O(1) arithmetic comparisons and table lookups, totaling O(n * amount) operations.",
    spaceExplanation: "Excluding the input vector 'coins' of size n, the algorithm allocates a dynamic programming table 'dp' of size amount + 1 integers, requiring O(amount) auxiliary heap memory.",
    statusSummary: "The algorithm is a textbook implementation of the dynamic programming coin change algorithm with explicit loop bounds and straightforward memory usage.",
    codeByLang: {
      cpp: `#include <vector>
#include <algorithm>

int coinChange(const std::vector<int>& coins, int amount) {
    int n = coins.size();
    // Allocate DP array of size amount + 1
    std::vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;

    // Outer loop runs 'amount' times
    for (int i = 1; i <= amount; i++) {
        // Inner loop runs n times for each coin
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = std::min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      python: `def coin_change(coins, amount):
    n = len(coins)
    # Auxiliary space: DP array of size amount + 1
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    
    # Outer loop: 1 to amount
    for i in range(1, amount + 1):
        # Inner loop: iterate through all n coins
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
                
    return dp[amount] if dp[amount] <= amount else -1`,
      c: `#include <stdio.h>

int coin_change(int coins[], int n, int amount) {
    int dp[amount + 1];
    for (int i = 0; i <= amount; i++) dp[i] = amount + 1;
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < n; j++) {
            if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i]) {
                dp[i] = dp[i - coins[j]] + 1;
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      java: `import java.util.Arrays;

public class Solution {
    public static int coinChange(int[] coins, int amount) {
        int n = coins.length;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      javascript: `function coinChange(coins, amount) {
    const n = coins.length;
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      go: `func coinChange(coins []int, amount int) int {
    n := len(coins)
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = amount + 1
    }
    dp[0] = 0

    for i := 1; i <= amount; i++ {
        for j := 0; j < n; j++ {
            if coins[j] <= i && dp[i-coins[j]]+1 < dp[i] {
                dp[i] = dp[i-coins[j]] + 1
            }
        }
    }
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}`
    },
    optimizedCode: `# The 1D bottom-up tabulation approach is already optimal for the unbounded Coin Change problem.
# Space: O(amount), Time: O(n * amount).`
  },
  {
    id: 'linear-traversal',
    name: 'Linear Traversal',
    subname: 'Single Loop',
    category: 'Linear O(n)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Single pass iteration summing all elements in a list.',
    timeExplanation: 'The algorithm executes a single for-loop that sequentially touches each of the n items once. Each iteration performs O(1) addition, yielding O(n) total runtime.',
    spaceExplanation: 'Uses only scalar accumulator variables. No dynamic data structures are allocated, requiring strictly O(1) auxiliary space.',
    statusSummary: 'Textbook single-pass linear traversal algorithm with optimal asymptotic bounds.',
    codeByLang: {
      python: `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

# Single pass over n elements
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(calculate_sum(data))`,
      cpp: `#include <iostream>
#include <vector>

int calculate_sum(const std::vector<int>& numbers) {
    int total = 0;
    // Single linear loop executes n times
    for (int num : numbers) {
        total += num;
    }
    return total;
}

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    std::cout << calculate_sum(data) << std::endl;
    return 0;
}`,
      c: `#include <stdio.h>

int calculate_sum(int numbers[], int n) {
    int total = 0;
    // Single pass: O(n) time, O(1) space
    for (int i = 0; i < n; i++) {
        total += numbers[i];
    }
    return total;
}

int main() {
    int data[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int n = sizeof(data) / sizeof(data[0]);
    printf("%d\\n", calculate_sum(data, n));
    return 0;
}`,
      java: `public class Solution {
    public static int calculateSum(int[] numbers) {
        int total = 0;
        // Linear traversal over n elements
        for (int num : numbers) {
            total += num;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] data = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        System.out.println(calculateSum(data));
    }
}`,
      javascript: `function calculateSum(numbers) {
    let total = 0;
    // Single loop over n items: O(n) time, O(1) space
    for (let num of numbers) {
        total += num;
    }
    return total;
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(calculateSum(data));`,
      go: `package main
import "fmt"

func calculateSum(numbers []int) int {
    total := 0
    // Linear pass: O(n)
    for _, num := range numbers {
        total += num
    }
    return total
}

func main() {
    data := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    fmt.Println(calculateSum(data))
}`
    },
    optimizedCode: `return sum(numbers)`
  },
  {
    id: 'constant-access',
    name: 'Constant Time Access',
    subname: 'Elementary',
    category: 'Constant O(1)',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    description: 'Direct memory index and hash map lookup in O(1) constant time.',
    timeExplanation: 'Direct array offset address calculation and hash table lookup execute in bounded O(1) operations independent of input size.',
    spaceExplanation: 'Allocates no dynamic memory or buffers. Auxiliary space is strictly O(1).',
    statusSummary: 'Elementary constant-time operation with instantaneous microsecond latency.',
    codeByLang: {
      python: `def get_first_and_lookup(items, lookup_dict, key):
    # Direct index access: O(1)
    first_item = items[0] if items else None
    
    # Hash table lookup: O(1) average
    val = lookup_dict.get(key, None)
    
    return first_item, val`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

std::pair<int, int> lookup(const std::vector<int>& items, const std::unordered_map<int, int>& map, int key) {
    int first = items.empty() ? -1 : items[0];
    auto it = map.find(key);
    int val = (it != map.end()) ? it->second : -1;
    return {first, val};
}`,
      c: `int get_element_at(int arr[], int index) {
    return arr[index]; // O(1) pointer arithmetic
}`,
      java: `import java.util.Map;

public class ConstantLookup {
    public static int getFirst(int[] items, Map<String, Integer> map, String key) {
        int first = items.length > 0 ? items[0] : -1;
        Integer val = map.get(key);
        return first;
    }
}`,
      javascript: `function constantLookup(items, map, key) {
    const first = items[0];
    const val = map.get(key);
    return { first, val };
}`,
      go: `func constantLookup(items []int, lookupMap map[string]int, key string) (int, int) {
    return items[0], lookupMap[key]
}`
    },
    optimizedCode: `// Already optimal O(1).`
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    subname: 'Logarithmic',
    category: 'Logarithmic O(log n)',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'Divides sorted search interval in half each iteration.',
    timeExplanation: 'The search bounds are halved on every iteration: n, n/2, n/4, ..., 1. Halting occurs in at most floor(log2(n)) + 1 steps.',
    spaceExplanation: 'Iterative implementation maintains only pointers (left, right, mid), consuming O(1) auxiliary space without recursion stack frames.',
    statusSummary: 'Classic logarithmic comparison-based search algorithm on sorted sequences.',
    codeByLang: {
      python: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    # Halves interval each step: n -> n/2 -> n/4 -> ... -> 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
      cpp: `#include <vector>

int binary_search(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      c: `int binary_search(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `public class Search {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
      javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      go: `func binarySearch(arr []int, target int) int {
    left := 0
    right := len(arr) - 1
    for left <= right {
        mid := (left + right) / 2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`
    },
    optimizedCode: `# Already asymptotically optimal O(log n).`
  },
  {
    id: 'quadratic-nested',
    name: 'Quadratic Comparison',
    subname: 'Nested Loops',
    category: 'Quadratic O(n²)',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Inspects all pairs of elements with double nested loops (Two Sum brute force).',
    timeExplanation: 'The outer loop runs n times and the inner loop runs n - i - 1 times, performing n(n - 1) / 2 comparisons in O(n²) worst-case time.',
    spaceExplanation: 'Iterates in-place using pointer indexes, consuming O(1) auxiliary space without extra memory allocations.',
    statusSummary: 'Quadratic pair comparison pattern; candidates for hash map optimization to linear O(n).',
    codeByLang: {
      python: `def two_sum_bruteforce(nums, target):
    n = len(nums)
    # Outer loop executes n times
    for i in range(n):
        # Inner loop executes n - i - 1 times
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
      cpp: `#include <vector>

std::vector<int> two_sum(const std::vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`,
      c: `void find_pair(int nums[], int n, int target, int* out_i, int* out_j) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                *out_i = i;
                *out_j = j;
                return;
            }
        }
    }
}`,
      java: `public class Solution {
    public static int[] twoSumBruteForce(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
      javascript: `function twoSumBruteForce(nums, target) {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
      go: `func twoSumBruteForce(nums []int, target int) []int {
    n := len(nums)
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            if nums[i] + nums[j] == target {
                return []int{i, j}
            }
        }
    }
    return nil
}`
    },
    optimizedCode: `def two_sum_hashmap(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
  },
  {
    id: 'divide-conquer-sort',
    name: 'Divide & Conquer',
    subname: 'Merge Sort',
    category: 'Linearithmic O(n log n)',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides list into halves, sorts recursively, and merges sorted halves.',
    timeExplanation: 'Recurrence relation: T(n) = 2T(n/2) + O(n). Solved via Master Theorem Case 2 to yield provably optimal O(n log n) comparison sorting time.',
    spaceExplanation: 'The merging phase allocates temporary buffers for left and right subarrays, requiring O(n) auxiliary heap memory.',
    statusSummary: 'Classic divide-and-conquer comparison sorting algorithm.',
    codeByLang: {
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    # Recurrence: T(n) = 2T(n/2) + O(n)
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      cpp: `#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void merge_sort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        // T(n) = 2T(n/2) + O(n)
        merge_sort(arr, l, m);
        merge_sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      c: `void merge_sort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        merge_sort(arr, l, m);
        merge_sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      java: `public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
}`,
      javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}`,
      go: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    return merge(left, right)
}`
    },
    optimizedCode: `# Merge sort is already asymptotically optimal O(n log n).`
  },
  {
    id: 'exponential-fibonacci',
    name: 'Exponential Recursion',
    subname: 'Fibonacci',
    category: 'Exponential O(2ⁿ)',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n)',
    description: 'Double branching recursive computation without memoization.',
    timeExplanation: 'Recurrence relation: T(n) = T(n-1) + T(n-2) + O(1). Spawns 2 sub-calls at each level, generating an exponential recursion tree of depth n with O(2ⁿ) nodes.',
    spaceExplanation: 'Auxiliary heap memory is O(1), but recursive execution reaches a maximum call stack depth of n frames, requiring O(n) stack space.',
    statusSummary: 'Un-memoized double recursion exhibiting catastrophic exponential explosion.',
    codeByLang: {
      cpp: `int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    // T(n) = T(n-1) + T(n-2) + O(1) -> O(2ⁿ)
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      python: `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    # Recurrence: T(n) = T(n-1) + T(n-2) + O(1)
    return fibonacci(n - 1) + fibonacci(n - 2)`,
      c: `int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      java: `public class Solution {
    public static int fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
      javascript: `function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      go: `func fibonacci(n int) int {
    if n <= 0 {
        return 0
    }
    if n == 1 {
        return 1
    }
    return fibonacci(n-1) + fibonacci(n-2)
}`
    },
    optimizedCode: `def fibonacci_dp(n):
    if n <= 0: return 0
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`
  }
];
