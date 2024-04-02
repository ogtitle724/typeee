import revalidate from "./revalidate";
import debounce from "./debounce";
import { isJson } from "./text";

class Fetch {
  constructor() {
    this.defaultOptions = {
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    };
    this.reqCount = 1000;
  }

  //intercept response and set auth header
  async interceptRes(res) {
    return res;
  }

  async request(url, options = {}) {
    const newOptions = JSON.parse(JSON.stringify(this.defaultOptions));

    Object.keys(options).forEach((attr) => {
      if (attr === "body") {
        newOptions.body = options[attr];

        if (isJson(options.body)) {
          options.headers["Content-Type"] = "application/json";
        }
      } else if (typeof options[attr] === "object") {
        newOptions[attr] = { ...newOptions[attr], ...options[attr] };
      } else {
        newOptions[attr] = options[attr];
      }
    });

    if (this.reqCount) {
      this.reqCount--;

      try {
        let res = await fetch(url, newOptions);
        if (!res.ok) throw Error(`${res.status} ${res.statusText}`);

        res = await this.interceptRes(res);
        return res;
      } catch (err) {
        console.error("Request error:", err.message);
        throw err;
      }
    } else {
      setTimeout(() => {
        this.reqCount = 1000;
      }, 1000 * 60 * 5);
    }
  }

  async get(url, options = {}) {
    return this.request(url, {
      ...options,
      next: { tags: ["get"] },
      method: "GET",
    });
  }

  async post(url, data, options = {}) {
    const debounceArg = () => {
      revalidate();

      return this.request(url, {
        ...options,
        method: "POST",
        body: data,
      });
    };

    const debouncedFunc = debounce(debounceArg, 400);
    return debouncedFunc();
  }

  async patch(url, data, options = {}) {
    const debounceArg = () => {
      revalidate();

      return this.request(url, {
        ...options,
        method: "PATCH",
        body: data,
      });
    };

    const debouncedFunc = debounce(debounceArg, 400);
    return debouncedFunc();
  }

  async delete(url, options = {}) {
    revalidate();
    return this.request(url, { ...options, method: "DELETE" });
  }
}

// Export a single instance of the CustomFetch class
// eslint-disable-next-line import/no-anonymous-default-export
let fetchIns = new Fetch();
export default fetchIns;
