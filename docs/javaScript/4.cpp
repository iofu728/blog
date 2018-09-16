/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 14:33:37
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 16:03:06
 */
#include <iostream>
#include <map>
#include <stack>
#include <vector>

using namespace std;

struct node {
  int id, left, right;
};

vector<string> int2string;
map<string, int> string2int;
std::vector<node> v(11);
std::vector<int> middle;
bool vis[11] = {false};

int main(int argc, char const *argv[]) {
  string temp;
  int root = 0, index = 0, num, time = 9;
  while (cin >> temp) {
    int tempindex = 0;
    string now, father;
    while (tempindex < temp.size() && temp[tempindex] != '(') ++tempindex;
    now = temp.substr(0, tempindex);
    int nextindex = tempindex;
    while (nextindex < temp.size() && temp[nextindex] != ',') ++nextindex;
    father = temp.substr(tempindex + 1, nextindex - 2);
    num = temp[nextindex + 1] - '0';
    int2string.push_back(now);
    string2int[now] = index;
    if (!num) {
      root = index;
    } else if (num == 1) {
      v[string2int[father]].left = index;
    } else {
      v[string2int[father]].right = index;
    }
    v[index] = {index, -1, -1};
    ++index;
  }
  stack<node> s;
  s.push(v[root]);

  while (!s.empty()) {
    node front = s.top();
    vis[front.id] = true;
    if (front.left != -1) {
      if (!vis[front.left]) {
        s.push(v[front.left]);
        continue;
      } else {
        middle.push_back(front.id);
        s.pop();
        if (front.right != -1 && !vis[front.right]) {
          s.push(v[front.right]);
        }
        continue;
      }
    } else if (front.right == -1) {
      middle.push_back(front.id);
      s.pop();
      continue;
    } else {
      middle.push_back(front.id);
      s.pop();
      if (!vis[front.right]) {
        s.push(v[front.right]);
      }
      continue;
    }
  }
  for (int i = 0; i < middle.size(); ++i) {
    if (i) cout << ' ';
    cout << int2string[middle[i]];
  }
  return 0;
}
