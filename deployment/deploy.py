#!/usr/bin/env python3
import argparse
import os
import random
import re
import shlex
import socket
import subprocess
import sys
import time
from datetime import datetime


DEPLOYMENT_DIR = os.path.dirname(os.path.abspath(__file__))

PROJECT_NAME = 'moviesservice'
APP_SERVICE = 'app'

TUNNEL_PORT = random.randint(20000, 30000)

STAGES = {
    'main': {'host': 'TODO_server_name', 'nginx_port': 80},
    'develop': {'host': 'TODO_server_name', 'nginx_port': 8080},
}


class DockerTunnel(object):
    def __init__(self, stage):
        self.stage = stage
        self.host = STAGES[self.stage]["host"]
        self.port = TUNNEL_PORT

    def is_connected(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)

        try:
            sock.connect(('localhost', self.port))
            sock.shutdown(socket.SHUT_RDWR)
            return True
        except:
            pass
        finally:
            sock.close()

        return False

    def __enter__(self):
        print('Setting up docker.sock tunnel..')
        self.process = subprocess.Popen(
            shlex.split(
                f'ssh -N -L{self.port}:/var/run/docker.sock {self.host}'
            ),
            text=True,
            env=os.environ.copy(),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )

        while not self.is_connected():
            time.sleep(0.5)

        print('Connected.')

    def __exit__(self, type, value, traceback):
        print('Returned from command. Shutting down tunnel..')
        self.process.terminate()
        self.process.wait()


def get_env(stage):
    env = os.environ.copy()

    env.update(
        {
            'DOCKER_HOST': f'tcp://localhost:{TUNNEL_PORT}',
            'COMPOSE_PROJECT_NAME': f'{PROJECT_NAME}{stage}',
            'COMPOSE_FILE': os.path.join(DEPLOYMENT_DIR, 'docker-compose.yml'),
            'COMPOSE_STAGE': stage,
            'COMPOSE_NGINX_PORT': str(STAGES[stage]['nginx_port']),
        }
    )

    return env


def shell_command(stage, command, silent=False):
    print(command)
    command = shlex.split(command)
    process = subprocess.Popen(
        command,
        text=True,
        env=get_env(stage),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    lines = []
    while True:
        line = process.stdout.readline()
        if line:
            lines.append(line.strip())
            if not silent:
                print(line.strip())
        rc = process.poll()
        if rc is not None:
            return (rc, lines)


def ensure_tunnel(command):
    def inner(options):
        with DockerTunnel(options.stage):
            command(options)
    return inner


@ensure_tunnel
def run_deploy(options):
    result = shell_command(options.stage, 'docker-compose pull --quiet')
    if result[0] != 0:
        sys.exit(result[0])

    result = shell_command(options.stage, 'docker-compose up -d --build')
    sys.exit(result[0])


@ensure_tunnel
def run_exec(options):
    result = shell_command(
        options.stage, f'docker-compose exec -T {APP_SERVICE} {options.command}'
    )
    sys.exit(result[0])


def get_options():
    parser = argparse.ArgumentParser()
    parser.set_defaults(method=lambda _: sys.exit(1))
    parser.add_argument(
        '-s',
        '--stage',
        choices=list(STAGES),
        required=True,
        help='Stage the command is executed for',
    )

    subparsers = parser.add_subparsers(help='commands')

    parser_deploy = subparsers.add_parser('deploy', help='Deploy stage')
    parser_deploy.set_defaults(method=run_deploy)

    parser_exec = subparsers.add_parser('exec', help='Execute command in stage')
    parser_exec.add_argument('command', help='Command to execute')
    parser_exec.set_defaults(method=run_exec)

    return parser.parse_args()


if __name__ == '__main__':
    options = get_options()
    options.method(options)
