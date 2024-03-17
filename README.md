# midi to bitsy
there should be 16 notes in a bar you can make 1 note as long as an entire bar. if your midi file is polyphonic notes would be deleted from it to make it monophonic. add a main melody to get data or add another midi file to bass/counter melody to get both data.
the maximum number of bars in bitsy currently is 16 
look at the demonstration midi as an example of what you can do. make sure you dont make long notes pass over from one bar into another bar
![alt text](dontdothis.png "midi")

even though there I coded some slight quantization. in logic or any other program that doesnt quantize note lengths you should use a fixed note length function and edit the length manually just in case


