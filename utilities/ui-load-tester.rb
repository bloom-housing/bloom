# What is this:
#   This is a ruby script to load test any of our front end urls

# Why is this written in ruby?
#   Ruby supports multithreading much better natively than node/js does

# How to use:
#   `ab` is a benchmarking utility, its used here to mock traffic to whatever url you pass along
#   You can check out how `ab` works separately. On mac you can run `man ab` in a terminal to get the manual for ab
#   you can change the n arguments on these calls to increase the total number of requests
#   you can change the c arguments on these calls to increase the throughput basically (number of requests made concurrently)
#   you can change the url arguments on these calls to direct which url will receive the traffic
#   to execute once your changes are made from the root directory run `yarn ui-load-test`
#   In order to test mem usage you can attach the node debugger to either the public or partner sites and track mem usage that way 
#   You can also track cpu usage, or track it through a cpu activity monitor

def main()
  # call main page english
  spawnProcess(100, 10, "http://localhost:3000/")
end
  
  # n: the number of requests
  # c:  the number of calls made concurrently
  # url: the url you are trying to hit
  def spawnProcess(n, c, url)
    spawn("ab -n #{n} -c #{c} \"#{url}\"")
  end
  
  main()
  