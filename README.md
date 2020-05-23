# Schímatos
A SHACL-based Web-Form Generator for Knowledge Graph Editing

Knowledge graph creation and maintenance is typically inaccessible to naïve users.
One barrier is the paucity of user-friendly publishing tools that separate schema modeling from the data creation.

The *Shapes Constraint Language* (SHACL) is a W3C standard for validating RDF-based knowledge graphs against a set of conditions provided as shapes.
This enables structure, i.e. domain-relevant patterns, to be enforced on data graphs built against pre-defined shapes.  

**Schímatos** is a form-based Web application with which users can create and edit data against such shapes graphs.
Forms are generated from and stored as shapes graphs.
These graphs may either be handcrafted within the tool (using a form building GUI), assembled by aggregating existing shapes graphs (also available as a GUI), or automatically generated with machine learning techniques.

During data-entry, the tool uses entity relationships and attribute requirements to generate a Web-form for end-users.  Attribute constraints are then used to perform client-side validation.  Thus, this tool enables end-users to create and edit complex data graphs abstracted in an easy-to-use GUI. 
 Additionally, validation procedures reduce the introduction of erroneous data.

## License
Content submitted to [schimatos.org](http://schimatos.org/) is MIT licensed, as found in the [LICENSE.md](https://github.com/schimatos/schimatos.org/blob/master/LICENSE) file.
