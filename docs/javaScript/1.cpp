/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 13:29:40
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 13:45:48
 */
#include <iostream>

using namespace std;

int main(int argc, char const *argv[]) {
  int n;
  cin >> n;
  int total[n], sum = 0, left = 0, right = 1;
  bool haveit = false;
  total[0] = 0;
  for (int i = 1; i < n; ++i) {
    sum += i;
    total[i] = sum;
  }
  for (int i = 0; i < n; ++i) {
    left = i;
    while (total[right] - total[left] < n && right < n - 1) ++right;
    while (total[right] - total[left] > n && right > left) --right;
    if (total[right] - total[left] == n) {
      haveit = true;
      for (int j = left + 1; j <= right; ++j) {
        if (j != left + 1) cout << ' ';
        cout << j;
      }
      cout << endl;
    }
  }
  if (!haveit) cout << "NONE";
  return 0;
}
