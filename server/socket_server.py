import socket
HOST = 'localhost'
PORT = 8086
ADDR = (HOST, PORT)
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(ADDR)
s.listen(5)
print('Server start at: %s:%s' % (HOST, PORT))
print('Wait for connection...')
while True:
    conn, addr = s.accept()
    #print('Connected by %s' % addr)

    while True:
        data = conn.recv(1024)
        print(data)
        conn.send('server received you message'.encode('utf-8'))
