import subprocess
import time
import select

process = subprocess.Popen(
    ["java", "-jar", "billing-mcp-server/target/billing-mcp-server-0.0.1-SNAPSHOT.jar"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

init_message = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n'

print("Waiting 10 seconds for server to start...")
for i in range(10):
    r, _, _ = select.select([process.stderr], [], [], 1.0)
    if process.stderr in r:
        line = process.stderr.readline()
        if line:
            print("STDERR:", line.strip())

print("Sending init message...")
process.stdin.write(init_message)
process.stdin.flush()

print("Waiting for response...")
for i in range(15):
    time.sleep(1)
    if process.stdout:
        r, _, _ = select.select([process.stdout, process.stderr], [], [], 1.0)
        if process.stdout in r:
            line = process.stdout.readline()
            if line:
                print("Response:", line.strip())
                break
        if process.stderr in r:
            line = process.stderr.readline()
            if line:
                print("STDERR:", line.strip())
else:
    print("No response within 15 seconds.")
    
process.kill()
