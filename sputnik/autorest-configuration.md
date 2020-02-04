# AutoRest Sputnik

The Sputnik plugin is used to show a sample plugin and it's parts.
Searching for the word 'Sputnik' in this project will find all the places that need to be changed. 

### Autorest plugin configuration
- Please don't edit this section unless you're re-configuring how the Sputnik extension plugs in to AutoRest
AutoRest needs the below config to pick this up as a plug-in - see https://github.com/Azure/autorest/blob/master/docs/developer/architecture/AutoRest-extension.md

> if the modeler is loaded already, use that one, otherwise grab it.

> Multi-Api Mode
``` yaml
pipeline-model: v3
```

# Pipeline Configuration
``` yaml

modelerfour:
  flatten-models: true
  flatten-payloads: true
  group-parameters: true
  prenamer: true
  merge-response-headers: false
  

pipeline:
  # Choose names for everything 
  sputnik-namer:
    input: modelerfour/identity

  # extensibility: allow transforms after the naming
  sputnik-namer/new-transform: 
    input: sputnik-namer 

  # generates code
  sputnik:
    input: sputnik-namer/new-transform # and the generated c# files

  # extensibility: allow text-transforms after the code gen
  sputnik/text-transform:
    input: sputnik

  # output the files to disk
  sputnik/emitter:
    input: 
      - sputnik-namer/new-transform  # this allows us to dump out the code model after the namer (add --output-artifact:code-model-v4 on the command line)
      - sputnik/text-transform # this grabs the outputs after the last step.
      
    is-object: false # tell it that we're not putting an object graph out
    output-artifact: source-file-sputnik # the file 'type' that we're outputting.

  #sputnik/emitter/command:
  #  input: emitter
  #  run: 
  #    - node -e "console.log('hi'); process.exit(1);"
  #    - node -e "console.log('hi'); process.exit(0);"
```
