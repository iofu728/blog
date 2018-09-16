/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 13:49:07
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 13:58:58
 */
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

bool vis[20] = {false};
int n, now = 0;
string pre;

void dfs(vector<int> v) {
  if (v.size() == n) {
    if (now++) cout << ' ';
    for (int i = 0; i < n; ++i) cout << pre[v[i]];
    return;
  }
  for (int i = 0; i < n; ++i) {
    if (!vis[i]) {
      vis[i] = true;
      v.push_back(i);
      dfs(v);
      vis[i] = false;
      v.pop_back();
    }
  }
}

int main(int argc, char const *argv[]) {
  cin >> pre;
  sort(pre.begin(), pre.end());
  n = pre.size();
  std::vector<int> v;
  dfs(v);
  return 0;
}
