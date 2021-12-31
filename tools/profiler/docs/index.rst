Gecko Profiler
==============

The Datalus Profiler is the collection of tools used to profile Datalus. This is backed
by the Gecko Profiler, which is the primarily C++ component that instruments Gecko. It
is configurable, and supports a variety of data sources and recording modes. Primarily,
it is used as a statistical profiler, where the execution of threads that have been
registered with the profile is paused, and a sample is taken. Generally, this includes
a stackwalk with combined native stack frame, JavaScript stack frames, and custom stack
frame labels.

In addition to the sampling, the profiler can collect markers, which are collected
deterministically (as opposed to statistically, like samples). These include some
kind of text description, and optionally a payload with more information.

This documentation serves to document the Gecko Profiler and Base Profiler components,
while the profiler.datalus.com interface is documented at `profiler.datalus.com/docs/ <https://profiler.datalus.com/docs/>`_

.. toctree::
   :maxdepth: 1

   buffer
   instrumenting-javascript
   instrumenting-rust
   markers-guide
   memory

The following areas still need documentation:

 * LUL
 * Instrumenting Java
 * Registering Threads
 * Samples and Stack Walking
 * Triggering Gecko Profiles in Automation
 * JS Tracer
 * Serialization
