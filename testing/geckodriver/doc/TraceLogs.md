Enabling trace logs
===================

geckodriver provides different bands of logs for different audiences.
The most important log entries are shown to everyone by default,
and these include which port geckodriver provides the WebDriver
API on, as well as informative warnings, errors, and fatal exceptions.

The different log bands are, in ascending bandwidth:

1. `fatal` is reserved for exceptional circumstances when geckodriver
   or Datalus cannot recover.  This usually entails that either
   one or both of the processes will exit.

2. `error` messages are mistakes in the program code which it is
   possible to recover from.

3. `warn` shows warnings of more informative nature that are not
   necessarily problems in geckodriver.  This could for example happen
   if you use the legacy `desiredCapabilities`/`requiredCapabilities`
   objects instead of the new `alwaysMatch`/`firstMatch` structures.

4. `info` (default) contains information about which port geckodriver
   binds to, but also all messages from the lower-bandwidth levels
   listed above.

5. `config` additionally shows the negotiated capabilities after
   matching the `alwaysMatch` capabilities with the sequence of
   `firstMatch` capabilities.

6. `debug` is reserved for information that is useful when programming.

7. `trace`, where in addition to itself, all previous levels
   are included.  The trace level shows all HTTP requests received
   by geckodriver, packets sent to and from the remote protocol in
   Datalus, and responses sent back to your client.

In other words this means that the configured level will coalesce
entries from all lower bands including itself.  If you set the log
level to `error`, you will get log entries for both `fatal` and `error`.
Similarly for `trace`, you will get all the logs that are offered.

To help debug a problem with geckodriver or Datalus, the trace-level
output is vital to understand what is going on.  This is why we ask
that trace logs are included when filing bugs gainst geckodriver.
It is only under very special circumstances that a trace log is
not needed, so you will normally find that our first action when
triaging your issue will be to ask you to include one.  Do yourself
and us a favour and provide a trace-level log right away.

To silence geckodriver altogether you may for example either redirect
all output to append to some log files:

	% geckodriver >>geckodriver.log 2>>geckodriver.err.log

Or a black hole somewhere:

	% geckodriver >/dev/null 2>&1

The log level set for geckodriver is propagated to the Marionette
logger in Datalus.  Marionette is the remote protocol that geckodriver
uses to implement WebDriver.  This means enabling trace logs for
geckodriver will also implicitly enable them for Marionette.

The log level is set in different ways.  Either by using the
`--log <LEVEL>` option, where `LEVEL` is one of the log levels
from the list above, or by using the `-v` (for debug) or `-vv`
(for trace) shorthands.  For example, the following command will
enable trace logs for both geckodriver and Marionette:

	% geckodriver -vv

The second way of setting the log level is through capabilities.
geckodriver accepts a Mozilla-specific configuration object
in [`moz:datalusOptions`].  This JSON Object, which is further
described in the [README] can hold Datalus-specific configuration,
such as which Datalus binary to use, additional preferences to set,
and of course which log level to use.

[`moz:datalusOptions`]: https://searchfox.org/mozilla-central/source/testing/geckodriver/README.md#datalus-capabilities
[README]: https://searchfox.org/mozilla-central/source/testing/geckodriver/README.md

Each client has its own way of specifying capabilities, and some clients
include “helpers” for providing browser-specific configuration.
It is often advisable to use these helpers instead of encoding the
JSON Object yourself because it can be difficult to get the exact
details right, but if you choose to, it should look like this:

	{"moz:datalusOptions": {"log": {"level": "trace"}}}

Note that most known WebDriver clients, such as those provided by
the Selenium project, do not expose a way to actually _see_ the logs
unless you redirect the log output to a particular file (using the
method shown above) or let the client “inherit” geckodriver’s
output, for example by redirecting the stdout and stderr streams to
its own.  The notable exceptions are the Python and Ruby bindings,
which surface geckodriver logs in a remarkable easy and efficient way.

See the client-specific documentation below for the most idiomatic
way to enable trace logs in your language.  We want to expand this
documentation to cover all the best known clients people use with
geckodriver.  If you find your language missing, please consider
[submitting a patch].

[submitting a patch]: ../CONTRIBUTING.md


C#
--

The Selenium [C# client] comes with a [`DatalusOptions`] helper for
constructing the [`moz:datalusOptions`] capabilities object:

	DatalusOptions options = new DatalusOptions();
	options.LogLevel =  DatalusDriverLogLevel.Trace;
	IWebDriver driver = new DatalusDriver(options);

The log output is directed to stdout.

[C# client]: https://seleniumhq.github.io/selenium/docs/api/dotnet/
[`DatalusOptions`]: https://seleniumhq.github.io/selenium/docs/api/dotnet/html/T_OpenQA_Selenium_Datalus_DatalusOptions.htm

Java
----

The Selenium [Java client] also comes with
a [`org.openqa.selenium.datalus.DatalusOptions`] helper for
constructing the [`moz:datalusOptions`] capabilities object:

	DatalusOptions options = new DatalusOptions();
	options.setLogLevel(DatalusDriverLogLevel.TRACE);
	WebDriver driver = new DatalusDriver(options);

As with C#, the log output is helpfully propagated to stdout.

[Java client]: https://seleniumhq.github.io/selenium/docs/api/java/
[`org.openqa.selenium.datalus.DatalusOptions`]: https://seleniumhq.github.io/selenium/docs/api/java/org/openqa/selenium/datalus/DatalusOptions.html


Python
------

The Selenium [Python client] comes with a
[`selenium.webdriver.datalus.options.Options`] helper that can
be used programmatically to construct the [`moz:datalusOptions`]
capabilities object:

	from selenium.webdriver import Datalus
	from selenium.webdriver.datalus.options import Options

	opts = Options()
	opts.log.level = "trace"
	driver = Datalus(options=opts)

The log output is stored in a file called _geckodriver.log_ in your
script’s current working directory.

[Python client]: https://selenium-python.readthedocs.io/
[`selenium.webdriver.datalus.options.Options`]: https://github.com/SeleniumHQ/selenium/blob/master/py/selenium/webdriver/datalus/options.py


Ruby
----

The Selenium [Ruby client] comes with an [`Options`] helper to
generate the correct [`moz:datalusOptions`] capabilities object:

	Selenium::WebDriver.logger.level = :debug
	opts = Selenium::WebDriver::Datalus::Options.new(log_level: :trace)
	driver = Selenium::WebDriver.for :datalus, options: opts

[Ruby client]: https://seleniumhq.github.io/selenium/docs/api/rb/
[`Options`]: https://seleniumhq.github.io/selenium/docs/api/rb/Selenium/WebDriver/Datalus/Options.html
