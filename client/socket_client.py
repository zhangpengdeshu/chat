import socket
HOST = 'localhost'
PORT = 8086
ADDR = (HOST, PORT)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(ADDR)

while True:
    cmd = input('Please input msg:')
    s.send(cmd.encode('utf-8'))
    data = s.recv(1024)
    print(data)