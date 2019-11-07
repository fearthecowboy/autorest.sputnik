# AutoRest Sputnik

The Sputnik plugin is used to show a sample plugin and it's parts.
Searching for the word 'Sputnik' in this project will find all the places that need to be changed. 

### Autorest plugin configuration
- Please don't edit this section unless you're re-configuring how the Sputnik extension plugs in to AutoRest
AutoRest needs the below config to pick this up as a plug-in - see https://github.com/Azure/autorest/blob/master/docs/developer/architecture/AutoRest-extension.md

> if the modeler is loaded already, use that one, otherwise grab it.

``` yaml !isLoaded('@autorest/remodeler') 
use-extension:
  "@autorest/modelerfour" : "~4.0.0" 

# will use highest 4.0.x 
```


> Multi-Api Mode
``` yaml
pipeline-model: v3
```

# Pipeline Configuration
``` yaml
pipeline:
# --- extension remodeler ---

  # "Shake the tree", and normalize the model
  modelerfour:
    input: openapi-document/multi-api/identity     # the plugin where we get inputs from
  
  # extensibility: allow developer to do transformations on the code model. 
  modelerfour/new-transform: 
    input: modelerfour 
    
  # Choose names for everything 
  sputnik-namer:
    input: modelerfour/new-transform

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
```
