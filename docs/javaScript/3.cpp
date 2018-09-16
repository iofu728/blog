/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 14:02:04
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 14:27:53
 */
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main(int argc, char const *argv[]) {
  int n, maxlength = 1, maxindex = 0, index;
  cin >> n;
  int pre[n], d[n];
  std::vector<int> v[n];
  for (int i = 0; i < n; ++i) cin >> pre[i];
  fill(d, d + n, 0);
  d[0] = 1;
  v[0].push_back(pre[0]);
  for (int i = 1; i < n; ++i) {
    for (int j = i - 1; j >= 0; --j) {
      if (pre[j] > pre[i]) {
        if (v[j].size() + 1 > v[i].size()) {
          d[i] = d[j] + 1;
          v[i] = v[j];
          v[i].push_back(pre[i]);
          if (d[i] > maxlength) {
            maxlength = d[i];
            maxindex = i;
          }
        }
      }
    }
    if (!v[i].size()) {
      d[i] = 1;
      v[i].push_back(pre[i]);
    }
  }
  for (int i = 0; i < v[maxindex].size(); ++i) {
    if (i) cout << ' ';
    cout << v[maxindex][i];
  }

  return 0;
}
