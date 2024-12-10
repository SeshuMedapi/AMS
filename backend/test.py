import numpy as np
import plotly.graph_objects as go

# Function to calculate the rotation matrix
def calculate_rotation_matrix(yaw, pitch, roll):
    yaw_matrix = np.array([
        [np.cos(yaw), -np.sin(yaw), 0],
        [np.sin(yaw), np.cos(yaw), 0],
        [0, 0, 1]
    ])
    pitch_matrix = np.array([
        [np.cos(pitch), 0, np.sin(pitch)],
        [0, 1, 0],
        [-np.sin(pitch), 0, np.cos(pitch)]
    ])
    roll_matrix = np.array([
        [1, 0, 0],
        [0, np.cos(roll), -np.sin(roll)],
        [0, np.sin(roll), np.cos(roll)]
    ])
    return np.dot(np.dot(roll_matrix, pitch_matrix), yaw_matrix)

# Function to apply rotation to cuboid vertices
def rotate_cuboid(vertices, rotation_matrix):
    return np.dot(vertices, rotation_matrix.T)

# Define the original cuboid vertices (side length = 1, centered at origin)
vertices = np.array([
    [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5],
    [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]
])

# Define the faces of the cuboid using vertex indices
faces = [
    [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
    [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]
]

# Simulated yaw, pitch, roll (in radians)
yaw, pitch, roll = np.radians(30), np.radians(20), np.radians(10)

# Calculate the rotation matrix and rotate the cuboid
rotation_matrix = calculate_rotation_matrix(yaw, pitch, roll)
rotated_vertices = rotate_cuboid(vertices, rotation_matrix)

# Separate rotated vertices into x, y, z coordinates
x, y, z = rotated_vertices[:, 0], rotated_vertices[:, 1], rotated_vertices[:, 2]

# Create the 3D cuboid using Plotly
fig = go.Figure()

# Add cuboid faces
for face in faces:
    fig.add_trace(go.Mesh3d(
        x=[x[i] for i in face],
        y=[y[i] for i in face],
        z=[z[i] for i in face],
        opacity=0.8,
        color='blue',
        alphahull=0
    ))

# Customize the layout
fig.update_layout(
    scene=dict(
        xaxis_title='X-axis',
        yaxis_title='Y-axis',
        zaxis_title='Z-axis',
        aspectratio=dict(x=1, y=1, z=1),
        xaxis=dict(range=[-1, 1]),
        yaxis=dict(range=[-1, 1]),
        zaxis=dict(range=[-1, 1]),
    ),
    title="3D Cuboid with Orientation"
)

# Show the plot
fig.show()